export type IntermediateStationType = {
  entryId: string;
  type: string;
  time: TimeType;
  stationId: string;
  nickname: string;
  address: AddressType;
  remarks: string;
};

export type EndpointStationType = {
  outside: boolean;
  stationId: string;
  nickname: string;
  address: AddressType;
};

export type AddressType = {
  name: string;
  mapid: string;
  lat: number;
  lon: number;
  administrative: {
    province: string;
    city: string;
    district: string;
  };
};

export type TimeType = {
  day: number;
  subTime: string;
};

export type NewRunType = {
  plate: {
    number: {
      province: string;
      detail: string;
    };
    type: string;
  };
  station: {
    from: EndpointStationType;
    intermediate: IntermediateStationType[];
    to: EndpointStationType;
  };
  company: {
    id: string;
    desc: string;
  };
  schedule: {
    departTime: string;
    frequency: string;
    explain: string;
  };
  shuttle: {
    enabled: false;
    startTime: string;
    endTime: string;
  };
};

export type NewStationType = {
  name: string;
  address: AddressType;
  time: {
    open: string;
    close: string;
  };
  facilities: {
    toilet: boolean;
  };
};
