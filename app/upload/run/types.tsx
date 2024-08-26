export type IntermediateStationType = {
  type: string;
  time: string;
  address: AddressType;
};

export type AddressType = {
  name: string;
  id: string;
  mapid: string;
  lat: number;
  lon: number;
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
    from: {
      outside: boolean;
      id: string;
      address: AddressType;
    };
    intermediate: IntermediateStationType[];
    to: {
      outside: boolean;
      id: string;
      address: AddressType;
    };
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
