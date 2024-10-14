'use server';

import provinces from '@/utils/province.json';
import cities from '@/utils/city.json';
import counties from '@/utils/county.json';
import towns from '@/utils/town.json';

export async function getProvince(): Promise<{ name: string; id: string }[]> {
  return provinces;
}

export async function getCity(
  province: string
): Promise<{ province: string; name: string; id: string }[]> {
  if (Object.getOwnPropertyNames(cities).indexOf(province) === -1) {
    return [];
  }
  return cities[province as keyof typeof cities];
}

export async function getCounty(
  city: string
): Promise<{ city: string; name: string; id: string }[]> {
  if (Object.getOwnPropertyNames(counties).indexOf(city) === -1) {
    return [];
  }
  return counties[city as keyof typeof counties];
}

export async function getTown(
  county: string
): Promise<{ city: string; name: string; id: string }[]> {
  if (Object.getOwnPropertyNames(towns).indexOf(county) === -1) {
    return [];
  }
  return towns[county as keyof typeof towns];
}
