import {
  Group,
  TextInput,
  Button,
  Text,
  Stack,
  Divider,
  Tabs,
  rem,
  Space,
  Box,
  Select,
  LoadingOverlay,
  Grid,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { useImmer } from 'use-immer';
import { IconSearch, IconAdjustmentsPin } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useDisclosure } from '@mantine/hooks';

import MapContainer from './MapComponent';
import { getProvince, getCity, getTown, getCounty } from '@/components/Amap/regionSolver';

export function SearchPOI({
  onClose,
}: {
  onClose: (selected: {
    id: string;
    name: string;
    lon: number;
    lat: number;
    administrative: {
      province: string | null;
      city: string | null;
      district: string | null;
      town: string | null;
    };
  }) => void;
}) {
  const [map, setMap] = useState(null as any);
  const [markers, setMarkers] = useState([] as any[]);
  const [activeTab, setActiveTab] = useState<string | null>('search');

  const [province, setProvince] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [district, setDistrict] = useState<string | null>(null);
  const [town, setTown] = useState<string | null>(null);

  const [overlayVisible, { open: openOverlay, close: closeOverlay }] = useDisclosure(false);

  const [searchQuery, setSearchQuery] = useState('');
  // const [searchData, setSearchData] = useState(
  //   [] as {
  //     value: string;
  //     label: string;
  //   }[]
  // );
  const [searchResult, setSearchResult] = useImmer({
    id: '',
    name: '',
    lon: 116.397428,
    lat: 39.90923,
    administrative: {
      province: null,
      city: null,
      district: null,
      town: null,
    },
  } as {
    id: string;
    name: string;
    lon: number;
    lat: number;
    administrative: {
      province: string | null;
      city: string | null;
      district: string | null;
      town: string | null;
    };
  });

  const iconStyle = { width: rem(12), height: rem(12) };

  const [provinceData, setProvinceData] = useState<{ value: string; label: string }[]>([]);
  const [cityData, setCityData] = useState<{ value: string; label: string }[]>([]);
  const [districtData, setDistrictData] = useState<{ value: string; label: string }[]>([]);
  const [townData, setTownData] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    fetchProvinceData();
  }, []);

  useEffect(() => {
    if (province) {
      fetchCityData(province);
    }
  }, [province]);

  useEffect(() => {
    if (city) {
      fetchDistrictData(city);
    }
  }, [city]);

  useEffect(() => {
    if (district) {
      fetchTownData(district);
    }
  }, [district]);

  async function fetchProvinceData() {
    const data = (await getProvince()).map((provinceList) => ({
      value: provinceList.id,
      label: provinceList.name,
    }));
    setProvinceData(data);
  }

  async function fetchCityData(_province: string) {
    const data = (await getCity(_province)).map((cityList) => ({
      value: cityList.id,
      label: cityList.name,
    }));
    setCityData(data);
  }

  async function fetchDistrictData(_city: string) {
    const data = (await getCounty(_city)).map((districtList) => ({
      value: districtList.id,
      label: districtList.name,
    }));
    setDistrictData(data);
  }

  async function fetchTownData(_district: string) {
    const data = (await getTown(_district)).map((townList) => ({
      value: townList.id,
      label: townList.name,
    }));
    setTownData(data);
  }

  function onMarkerDragStart(event: any) {
    setSearchResult({
      id: searchResult.id,
      name: searchResult.name,
      lon: event.lnglat.lng,
      lat: event.lnglat.lat,
      administrative: searchResult.administrative,
    });
  }

  function onMarkerDragging(event: any) {
    setSearchResult({
      id: searchResult.id,
      name: searchResult.name,
      lon: event.lnglat.lng,
      lat: event.lnglat.lat,
      administrative: searchResult.administrative,
    });
  }

  function onMarkerDragEnd(event: any) {
    console.log(event);

    openOverlay();

    window.AMap.plugin('AMap.Geocoder', () => {
      const geocoder = new window.AMap.Geocoder();

      const lnglat = [event.lnglat.lng, event.lnglat.lat];

      geocoder.getAddress(lnglat, (status: string, result: any) => {
        if (status === 'complete' && result.info === 'OK') {
          setSearchResult({
            id: searchResult.id,
            name: searchResult.name,
            lon: event.lnglat.lng,
            lat: event.lnglat.lat,
            administrative: result.regeocode.addressComponent.adcode,
          });

          closeOverlay();
        }
        if (status === 'no_data' || Object.keys(result).length === 0) {
          notifications.show({
            title: '无法解析地址',
            message: '无法解析地址，请手动输入地址',
            color: 'yellow',
          });
        }
      });
    });
  }

  // @ts-ignore
  // @ts-ignore
  return (
    <>
      <Stack>
        <Tabs
          variant="outline"
          defaultValue="search"
          value={activeTab}
          onChange={(value) => {
            if (!searchResult.name) {
              notifications.show({
                title: '请先搜索地点',
                message: '请先搜索地点，然后再进行微调',
                color: 'red',
              });
              return;
            }
            if (value === 'search') {
              map?.clearMap();
              map?.add(markers);
            }
            if (value === 'finetune') {
              map?.clearMap();
              const marker = new window.AMap.Marker({
                position: new window.AMap.LngLat(searchResult.lon, searchResult.lat),
                draggable: true,
              });
              marker.on('dragstart', onMarkerDragStart);
              marker.on('dragging', onMarkerDragging);
              marker.on('dragend', onMarkerDragEnd);
              map?.add(marker);
            }
            setActiveTab(value);
          }}
        >
          <Tabs.List>
            <Tabs.Tab value="search" leftSection={<IconSearch style={iconStyle} />}>
              搜索
            </Tabs.Tab>
            <Tabs.Tab value="finetune" leftSection={<IconAdjustmentsPin style={iconStyle} />}>
              微调
            </Tabs.Tab>
          </Tabs.List>

          <LoadingOverlay
            visible={overlayVisible}
            zIndex={1000}
            overlayProps={{ radius: 'sm', blur: 2 }}
            loaderProps={{ type: 'bars' }}
          />

          <MapContainer setMap={setMap} />

          <Tabs.Panel value="search">
            <Space h="md" />
            <Group grow preventGrowOverflow={false}>
              {/*<Select
                searchValue={testValue}
                onSearchChange={onSearchLocationChange}
                data={searchData}
                searchable
                filter={({ options }) => options}
              />*/}

              <TextInput
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.currentTarget.value);
                }}
              />

              <Button
                onClick={() => {
                  if (map) {
                    map.clearMap();
                  }
                  // lon/lat of beijing
                  setSearchResult({
                    id: '',
                    name: '',
                    lon: 116.397428,
                    lat: 39.90923,
                    administrative: {
                      province: null,
                      city: null,
                      district: null,
                      town: null,
                    },
                  });
                  const placeSearch = new window.AMap.PlaceSearch({
                    pageSize: 5,
                    map,
                    autoFitView: true,
                  });
                  placeSearch.search(searchQuery, (status: string, result: any) => {
                    //查询成功时，result 即对应匹配的 POI 信息
                    console.log(result);

                    setMarkers(map.getAllOverlays('marker'));
                  });
                  window.AMap.Event.addListener(placeSearch, 'selectChanged', (event: any) => {
                    console.log(event);

                    // console.log(map.getAllOverlays('marker'));

                    setSearchResult({
                      id: event.selected.data.id,
                      name: event.selected.data.name,
                      lon: event.selected.data.location.lng,
                      lat: event.selected.data.location.lat,
                      administrative: {
                        province:
                          province !== null
                            ? province
                            : `${event.selected.data.adcode.slice(0, 2)}0000000000`,
                        city:
                          city !== null
                            ? city
                            : `${event.selected.data.adcode.slice(0, 4)}00000000`,
                        district:
                          district !== null ? district : `${event.selected.data.adcode}000000`,
                        town: town !== null ? town : null,
                      },
                    });

                    setProvince(`${event.selected.data.adcode.slice(0, 2)}0000000000`);
                    setCity(`${event.selected.data.adcode.slice(0, 4)}00000000`);
                    setDistrict(`${event.selected.data.adcode}000000`);
                  });
                }}
              >
                查看地图
              </Button>
            </Group>
          </Tabs.Panel>
        </Tabs>

        <Grid>
          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <Select
              name="province"
              label="省级"
              value={province}
              onChange={(_value, option) => {
                setProvince(option.value);
                setSearchResult((draft) => {
                  draft.administrative.province = option.value;
                });
                setCity(null);
                setDistrict(null);
                setTown(null);
              }}
              data={provinceData}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <Select
              name="city"
              label="市级"
              value={city}
              display={province !== '' ? 'block' : 'none'}
              onChange={(_value, option) => {
                setCity(option.value);
                setSearchResult((draft) => {
                  draft.administrative.city = option.value;
                });
                setDistrict(null);
                setTown(null);
              }}
              data={cityData}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <Select
              name="district"
              label="区级"
              value={district}
              display={city !== '' ? 'block' : 'none'}
              onChange={(_value, option) => {
                setDistrict(option.value);
                setSearchResult((draft) => {
                  draft.administrative.district = option.value;
                });
                setTown(null);
              }}
              data={districtData}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <Select
              name="town"
              label="镇级"
              value={town}
              display={district !== '' ? 'block' : 'none'}
              onChange={(_value, option) => {
                setTown(option.value);
                setSearchResult((draft) => {
                  draft.administrative.town = option.value;
                });
              }}
              data={townData}
            />
          </Grid.Col>
        </Grid>

        <Divider />

        <Group justify="space-between">
          {searchResult.name ? (
            <Text size="sm">
              当前选择的地点是：{searchResult.name}, {searchResult.lat}
              {searchResult.lat >= 0 ? 'N' : 'S'} {searchResult.lon}
              {searchResult.lon >= 0 ? 'E' : 'W'}{' '}
            </Text>
          ) : (
            <Box />
          )}
          <Button
            onClick={() => {
              if (!searchResult.id) {
                return;
              }
              map?.destroy();
              onClose({
                id: searchResult.id,
                name: searchResult.name,
                lon: searchResult.lon,
                lat: searchResult.lat,
                administrative: searchResult.administrative,
              });
            }}
          >
            确定选点
          </Button>
        </Group>
      </Stack>
    </>
  );
}
