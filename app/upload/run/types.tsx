export type IntermediateStationType = {
  station: string;
  time: string;
  type: string;
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
      address: string;
    };
    intermediate: IntermediateStationType[];
    to: {
      outside: boolean;
      id: string;
      address: string;
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
