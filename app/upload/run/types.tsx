export type IntermediateStationType = {
  type: string;
  time: string;
  address: {
    name: string;
    id: string;
    lat: string;
    lon: string;
  };
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
      address: {
        name: string;
        id: string;
        lat: string;
        lon: string;
      };
    };
    intermediate: IntermediateStationType[];
    to: {
      outside: boolean;
      id: string;
      address: {
        name: string;
        id: string;
        lat: string;
        lon: string;
      };
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
