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
import { useState } from 'react';
import { IconSearch, IconAdjustmentsPin } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useDisclosure } from '@mantine/hooks';

import MapContainer from './MapComponent';
import regions from '@/utils/chinaRegions.json';

export function SearchPOI({
  onClose,
}: {
  onClose: (selected: {
    id: string;
    name: string;
    lon: number;
    lat: number;
    administrative: {
      province: string;
      city: string;
      district: string;
    };
  }) => void;
}) {
  const [map, setMap] = useState(null as any);
  const [markers, setMarkers] = useState([] as any[]);
  const [activeTab, setActiveTab] = useState<string | null>('search');

  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');

  const [overlayVisible, { open: openOverlay, close: closeOverlay }] = useDisclosure(false);

  const [searchQuery, setSearchQuery] = useState('');
  // const [searchData, setSearchData] = useState(
  //   [] as {
  //     value: string;
  //     label: string;
  //   }[]
  // );
  const [searchResult, setSearchResult] = useState(
    {} as {
      id: string;
      name: string;
      lon: number;
      lat: number;
      administrative: {
        province: string;
        city: string;
        district: string;
      };
    }
  );

  const iconStyle = { width: rem(12), height: rem(12) };

  // function onSearchLocationChange(value: string) {
  //   console.log(window.AMap);
  // window.AMap.plugin('AMap.PlaceSearch', () => {
  //   console.log(map);
  //   const placeSearch = new window.AMap.PlaceSearch({});
  //   placeSearch.search(value, (status: string, result: any) => {
  //     //查询成功时，result 即对应匹配的 POI 信息
  //     console.log(result, typeof result);
  //     if (typeof result === 'string' || status !== 'complete') {
  //       setSearchData([]);
  //     } else {
  //       setSearchData(
  //         result.poiList.pois.map((item: any) => ({ value: item.stationId, label: item.name }))
  //       );
  //     }
  //   });
  // });
  // setTestValue(value);
  // }

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
                      province: '110000',
                      city: '110100',
                      district: '110101',
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
                        province: `${event.selected.data.adcode.slice(0, 2)}0000`,
                        city: `${event.selected.data.adcode.slice(0, 4)}00`,
                        district: event.selected.data.adcode,
                      },
                    });
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
              onChange={(_value, option) => setProvince(option.value)}
              data={regions.map((provinceList) => ({
                value: provinceList.code,
                label: provinceList.name,
              }))}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <Select
              name="city"
              label="市级"
              value={city}
              display={province !== '' ? 'block' : 'none'}
              onChange={(_value, option) => setCity(option.value)}
              data={(
                regions.find((value) => value.code === province) || { children: [] }
              ).children.map((cityList) => ({
                value: cityList.code,
                label: cityList.name,
              }))}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <Select
              name="district"
              label="区级"
              value={district}
              display={city !== '' ? 'block' : 'none'}
              onChange={(_value, option) => setDistrict(option.value)}
              data={(
                (regions.find((value) => value.code === province)?.children || []).find(
                  (value) => value.code === city
                )?.children || []
              ).map((cityList) => ({
                value: cityList.code,
                label: cityList.name,
              }))}
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
