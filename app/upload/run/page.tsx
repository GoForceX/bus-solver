import React from 'react';

import { SubmitBatch } from '@/components/SubmitForm/SubmitBatch';

export default async function Page() {
  async function getMockStationList() {
    'use server';

    return [
      { value: 'S13100001', label: '（河北省廊坊市）廊坊客运总站' },
      { value: 'S11000001', label: '（北京市）六里桥客运主枢纽' },
      { value: 'ADD', label: '+ 添加新站' },
    ];
  }

  async function getMockCompanyList() {
    'use server';

    return [
      { value: 'C13100001', label: '廊坊通利' },
      { value: 'C13100002', label: '廊坊交运' },
      { value: 'ADD', label: '+ 添加新公司' },
    ];
  }

  return (
    <>
      <SubmitBatch
        stationList={await getMockStationList()}
        companyList={await getMockCompanyList()}
      />
    </>
  );
}
