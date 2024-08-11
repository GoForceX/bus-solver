const plateProvince = [
  '粤',
  '川',
  '津',
  '沪',
  '渝',
  '蒙',
  '新',
  '藏',
  '宁',
  '桂',
  '陕',
  '浙',
  '晋',
  '冀',
  '青',
  '鲁',
  '豫',
  '苏',
  '皖',
  '辽',
  '贵',
  '闽',
  '赣',
  '湘',
  '鄂',
  '京',
  '琼',
  '甘',
  '云',
  '黑',
  '吉',
];

export function plateValidate(plateNumber: string): boolean {
  if (plateNumber.length > 8 || plateNumber.length < 7) {
    return false;
  }
  const province = plateNumber.substring(0, 1);
  const city = plateNumber.substring(1, 2);
  const number = plateNumber.substring(2);
  if (!plateProvince.includes(province)) {
    return false;
  }
  if (!/^[A-HJ-NP-Z]$/.test(city)) {
    return false;
  }
  if (!/^[A-HJ-NP-Z0-9]*$/.test(number)) {
    return false;
  }
  return true;
}

enum PlateCategory {
    Conventional,
    NewEnergy,
    Invalid
}

export function plateClassify(plateNumber: string): PlateCategory {
    if (!plateValidate(plateNumber)) {
        return PlateCategory.Invalid;
    }
    const numberLength = plateNumber.length;
    if (numberLength === 8) {
        return PlateCategory.NewEnergy;
    }
    return PlateCategory.Conventional;
}
