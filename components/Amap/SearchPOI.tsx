import { Group, TextInput, Button, Text, Stack, Divider, Tabs, rem, Space, Box } from '@mantine/core';
import { useState } from 'react';
import { IconSearch, IconAdjustmentsPin } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

import MapContainer from './MapComponent';

export function SearchPOI({
  onClose,
}: {
  onClose: (selected: { id: string; name: string; lon: number; lat: number }) => void;
}) {
  const [map, setMap] = useState(null as any);
  const [markers, setMarkers] = useState([] as any[]);
  const [activeTab, setActiveTab] = useState<string | null>('search');

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
  //         result.poiList.pois.map((item: any) => ({ value: item.id, label: item.name }))
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
    });
  }

  function onMarkerDragging(event: any) {
    setSearchResult({
      id: searchResult.id,
      name: searchResult.name,
      lon: event.lnglat.lng,
      lat: event.lnglat.lat,
    });
  }

  function onMarkerDragEnd(event: any) {
    setSearchResult({
      id: searchResult.id,
      name: searchResult.name,
      lon: event.lnglat.lng,
      lat: event.lnglat.lat,
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
                    });
                  });
                }}
              >
                查看地图
              </Button>
            </Group>
          </Tabs.Panel>
        </Tabs>

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
