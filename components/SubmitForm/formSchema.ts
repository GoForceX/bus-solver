import { z } from 'zod';
import { plateValidate } from '@/utils/plateValidate';
import { IntermediateStationType, NewRunType } from '@/app/upload/run/types';
import { compareTime } from '@/utils/compareTime';

const endpointStationSchema = z
  .object({
    outside: z.boolean(),
    stationId: z.string(),
    nickname: z.string(),
    address: z.object({
      name: z.string(),
      mapid: z.string(),
      lon: z.number(),
      lat: z.number(),
      administrative: z.object({
        province: z.string(),
        city: z.string(),
        district: z.string(),
      }),
    }),
  })
  .superRefine((value, ctx) => {
    if (!value.outside && value.stationId === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['id'],
        message: '请选择站点',
      });
    }
    if (value.outside && value.address.mapid === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['nickname'],
        message: '请选择地点',
      });
    }
    if (value.outside && value.nickname === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['nickname'],
        message: '请输入站点名称',
      });
    }
  });

export const runFormSchema = z
  .object({
    plate: z
      .object({
        number: z.object({
          province: z.string(),
          detail: z.string(),
        }),
        type: z.string().refine((val) => ['light', 'heavy', 'temp', 'other'].includes(val), {
          message: '车辆类型不正确',
        }),
      })
      .superRefine((value, ctx) => {
        const { type } = value;
        if (type !== 'other') {
          if (value.number.province === '' || value.number.detail === '') {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['number', 'detail'],
              message: '车牌号 / 省份不能为空',
            });
          } else if (!plateValidate(value.number.province + value.number.detail)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['number', 'detail'],
              message: '车牌格式不正确',
            });
          }
        } else if (value.number.detail === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['number', 'detail'],
            message: '车牌号',
          });
        }
      }),
    station: z.object({
      from: endpointStationSchema,
      intermediate: z.array(
        z
          .object({
            entryId: z.string().uuid(),
            address: z.object({
              name: z.string(),
              mapid: z.string(),
              lon: z.number(),
              lat: z.number(),
              administrative: z.object({
                province: z.string(),
                city: z.string(),
                district: z.string(),
              }),
            }),
            time: z.object({
              day: z.number(),
              subTime: z.string().min(1, {
                message: '请填写时间',
              }),
            }),
            type: z
              .string()
              .refine(
                (val) => ['station', 'outside', 'serviceArea', 'restSite', 'other'].includes(val),
                {
                  message: '站点类型不正确',
                }
              ),
            stationId: z.string(),
            nickname: z.string(),
            remarks: z.string(),
          })
          .superRefine((value, ctx) => {
            if (value.type !== 'outside' && value.stationId === '') {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['id'],
                message: '请选择站点',
              });
            }
            if (value.type === 'outside' && value.address.mapid === '') {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['nickname'],
                message: '请选择地点',
              });
            }
            if (value.type === 'outside' && value.nickname === '') {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['nickname'],
                message: '请输入站点名称',
              });
            }
          })
      ),
      to: endpointStationSchema,
    }),
    company: z.object({
      id: z.string().min(1, {
        message: '请选择运营公司',
      }),
      desc: z.string(),
    }),
    schedule: z
      .object({
        departTime: z.string().min(1, {
          message: '请选择发车时间',
        }),
        frequency: z
          .string()
          .min(1, {
            message: '请选择发车频率',
          })
          .refine((val) => ['daily', 'alternate', 'other'].includes(val), {
            message: '发车频率不正确',
          }),
        explain: z.string(),
      })
      .superRefine((value, ctx) => {
        if (value.frequency === 'other' && value.explain === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['explain'],
            message: '请填写发车频率',
          });
        }
      }),
    shuttle: z
      .object({
        enabled: z.boolean(),
        startTime: z.string(),
        endTime: z.string(),
      })
      .superRefine((value, ctx) => {
        if (value.enabled) {
          if (value.startTime === '') {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['startTime'],
              message: '请选择开始时间',
            });
          }
          if (value.endTime === '') {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['endTime'],
              message: '请选择结束时间',
            });
          }
        }
      }),
  })
  .required()
  .superRefine((value, ctx) => {
    if (value.station.intermediate.length > 0) {
      const timeList = value.station.intermediate.map((item) => item.time);
      timeList.forEach((time, index) => {
        if (index === 0) {
          if (compareTime(time, { day: 0, subTime: value.schedule.departTime }) === -1) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['station', 'intermediate', index, 'time', 'subTime'],
              message: '中途站时间不能早于发车时间',
            });
          }
        } else if (compareTime(time, timeList[index - 1]) === -1) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['station', 'intermediate', index, 'time', 'subTime'],
            message: '中途站时间不能早于上一站',
          });
        }
      });
    }
  });

export const runFormInitial: NewRunType = {
  plate: {
    number: {
      province: '',
      detail: '',
    },
    type: '',
  },
  station: {
    from: {
      outside: false,
      stationId: '',
      nickname: '',
      address: {
        name: '',
        mapid: '',
        lon: 116.397428,
        lat: 39.90923,
        administrative: {
          province: '110000',
          city: '110100',
          district: '110101',
        },
      },
    },
    intermediate: [] as IntermediateStationType[],
    to: {
      outside: false,
      stationId: '',
      nickname: '',
      address: {
        name: '',
        mapid: '',
        lon: 116.397428,
        lat: 39.90923,
        administrative: {
          province: '110000',
          city: '110100',
          district: '110101',
        },
      },
    },
  },
  company: {
    id: '',
    desc: '',
  },
  schedule: {
    departTime: '',
    frequency: '',
    explain: '',
  },
  shuttle: {
    enabled: false,
    startTime: '',
    endTime: '',
  },
};
