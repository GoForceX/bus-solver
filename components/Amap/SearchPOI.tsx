import { Group, TextInput, Button, Text, Stack } from '@mantine/core';
import { useState } from 'react';

import MapContainer from './MapComponent';

export function SearchPOI() {
  const [map, setMap] = useState(null as any);
  const [searchQuery, setSearchQuery] = useState('');
  // const [searchData, setSearchData] = useState(
  //   [] as {
  //     value: string;
  //     label: string;
  //   }[]
  // );
  const [searchResult, setSearchResult] = useState(
    {} as {
      value: string;
      label: string;
    }
  );

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

  return (
    <>
      <Stack>
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
              setSearchResult({
                value: '',
                label: '',
              });
              const placeSearch = new window.AMap.PlaceSearch({
                pageSize: 5,
                map,
                autoFitView: true,
              });
              placeSearch.search(searchQuery, (status: string, result: any) => {
                //查询成功时，result 即对应匹配的 POI 信息
                console.log(result);
              });
              window.AMap.Event.addListener(placeSearch, 'selectChanged', (event: any) => {
                console.log(event);

                setSearchResult({
                  value: event.selected.data.id,
                  label: event.selected.data.name,
                });
              });
            }}
          >
            查看地图
          </Button>
        </Group>

        <MapContainer setMap={setMap} />

        <Group>
          <Text size="sm">
            当前选择的地点是：{searchResult.label}，id 是：{searchResult.value}
          </Text>
        </Group>
      </Stack>
    </>
  );
}
