'use client';

import { AspectRatio } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    AMap: any;
    _AMapSecurityConfig: {
      serviceHost: string;
    };
  }
}

export default function MapContainer({ setMap }: { setMap: any }) {
  let map: any = null;
  const mapContainer = useRef(null);
  const [, setAmapLoaded] = useState(false);

  useEffect(() => {
    console.log(process.env);
    window._AMapSecurityConfig = {
      serviceHost: process.env.NEXT_PUBLIC_AMAP_SERVICE_HOST || '',
    };
    if (typeof window !== 'undefined') {
      import('@amap/amap-jsapi-loader').then((AMapLoader) => {
        AMapLoader.load({
          key: process.env.NEXT_PUBLIC_AMAP_KEY || '', // 申请好的Web端开发者Key，首次调用 load 时必填
          version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
          plugins: ['AMap.PlaceSearch'], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
        })
          .then((AMap) => {
            setAmapLoaded(true);
            map = new AMap.Map(mapContainer.current, {
              // 设置地图容器id
              viewMode: '3D', // 是否为3D地图模式
              zoom: 11, // 初始化地图级别
              center: [116.397428, 39.90923], // 初始化地图中心点位置
            });
            setMap(map);
          })
          .catch((e) => {
            console.log(e);
          });

        return () => {
          map?.destroy();
        };
      });
    }
  }, []);

  return (
    <AspectRatio ratio={16 / 9}>
      <div ref={mapContainer} style={{ minHeight: '256px' }}></div>
    </AspectRatio>
  );
}
