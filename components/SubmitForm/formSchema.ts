import { z } from 'zod';
import { plateValidate } from '@/app/upload/run/plateValidate';
import { IntermediateStationType, NewRunType } from '@/app/upload/run/types';
import { compareTime } from '@/app/upload/run/compareTime';

const endpointStationSchema = z
  .object({
    outside: z.boolean(),
    id: z.string(),
    nickname: z.string(),
    address: z.object({
      name: z.string(),
      mapid: z.string(),
      lon: z.number(),
      lat: z.number(),
      administrative: z.string(),
    }),
  })
  .superRefine((value, ctx) => {
    if (!value.outside && value.id === '') {
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
            address: z.object({
              name: z.string(),
              mapid: z.string(),
              lon: z.number(),
              lat: z.number(),
              administrative: z.string(),
            }),
            time: z.object({
              day: z.number(),
              subTime: z.string().time({
                message: '时间格式不正确',
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
            id: z.string(),
            nickname: z.string(),
            remarks: z.string(),
          })
          .superRefine((value, ctx) => {
            if (value.type !== 'outside' && value.id === '') {
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
  .required();

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
      id: '',
      nickname: '',
      address: {
        name: '',
        mapid: '',
        lon: 116.397428,
        lat: 39.90923,
        administrative: '',
      },
    },
    intermediate: [] as IntermediateStationType[],
    to: {
      outside: false,
      id: '',
      nickname: '',
      address: {
        name: '',
        mapid: '',
        lon: 116.397428,
        lat: 39.90923,
        administrative: '',
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
