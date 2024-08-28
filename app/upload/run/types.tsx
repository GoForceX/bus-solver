export type IntermediateStationType = {
  type: string;
  time: string;
  id: string;
  nickname: string;
  address: AddressType;
  remarks: string;
};

export type EndpointStationType = {
  outside: boolean;
  id: string;
  nickname: string;
  address: AddressType;
};

export type AddressType = {
  name: string;
  mapid: string;
  lat: number;
  lon: number;
  administrative: string;
};

export type NewRunType = {
  plate: {
    number: {
      province: string;
      detail: string;
    };
    type: string;
    otherDesc: string;
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
