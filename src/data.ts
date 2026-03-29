export interface Location {
  id: string;
  name: string;
  type: 'tourist' | 'cafe';
  lat: number;
  lng: number;
  imageUrl: string;
  videoUrl: string;
  description: string;
}

export const locations: Location[] = [
  {
    "id": "1",
    "name": "성산일출봉",
    "type": "tourist",
    "lat": 33.4581,
    "lng": 126.9426,
    "imageUrl": "https://picsum.photos/seed/seongsan/400/300",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "description": "유네스코 세계자연유산으로 지정된 제주의 상징적인 명소입니다."
  },
  {
    "id": "2",
    "name": "한라산 백록담",
    "type": "tourist",
    "lat": 33.3617,
    "lng": 126.5292,
    "imageUrl": "https://picsum.photos/seed/hallasan/400/300",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "description": "제주도 중앙에 위치한 대한민국에서 가장 높은 산입니다."
  },
  {
    "id": "3",
    "name": "애월 카페거리",
    "type": "cafe",
    "lat": 33.4624,
    "lng": 126.3106,
    "imageUrl": "https://picsum.photos/seed/aewol/400/300",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "description": "에메랄드빛 바다를 보며 커피를 즐길 수 있는 핫플레이스입니다."
  },
  {
    "id": "4",
    "name": "비자림",
    "type": "tourist",
    "lat": 33.4839,
    "lng": 126.7712,
    "imageUrl": "https://picsum.photos/seed/bijarim/400/300",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "description": "천 년의 세월을 간직한 비자나무 숲길입니다."
  },
  {
    "id": "1774634588542",
    "name": "제주기와카페",
    "type": "cafe",
    "lat": 33.4510979,
    "lng": 126.4255637,
    "videoUrl": "https://www.youtube.com/embed/fqhRYLYYU9k",
    "imageUrl": "https://static-file.jejupass.com/download/606895.webp?width=928&height=928",
    "description": "제주의 기와에서 마시는 커피와 드론촬영"
  },
  {
    "id": "1774634987467",
    "name": "노을리카페",
    "type": "cafe",
    "lat": 33.4791184,
    "lng": 126.3726565,
    "videoUrl": "https://www.youtube.com/embed/KuNXJMcDjYo",
    "imageUrl": "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSj46jVG7n7V3Hph4jZh2EgLKZ_-mz_zSc8u4HA2Bj2RXGsnjJ-cgZJaK5Xt69I",
    "description": "완전 해외같은 노을명소 노을 직빵으로 볼 수 있는 명당카페 #노을리카페"
  },
  {
    "id": "1774635300239",
    "name": "새빌카페",
    "type": "cafe",
    "lat": 33.3643469,
    "lng": 126.3631334,
    "videoUrl": "https://www.youtube.com/embed/NzgMA-MdH4A",
    "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJUhRrPLwQKJbTDD7DBJTy8TlsKQuUTHm4qabEKXr0I7g1GIldXstkZHOb11MA",
    "description": "핑크뮬리와 억새가 어우러진 가을 풍경 위주의 영상입니다."
  },
  {
    "id": "1774636448582",
    "name": "제주당",
    "type": "cafe",
    "lat": 33.3541964,
    "lng": 126.3559404,
    "videoUrl": "https://www.youtube.com/embed/_CE44-Ra7rE",
    "imageUrl": "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSmeW2Ju7nxWCRfn8ZQoxdXY9tjv9Ze5GEUMe5DtwWgcpfJZgsUrycSfp7YKxms",
    "description": "애월 지역의 인기 카페들과 함께 제주당의 분위기를 확인할 수 있습니다"
  },
  {
    "id": "1774636705454",
    "name": "이끼숲소길",
    "type": "cafe",
    "lat": 33.4002915,
    "lng": 126.3898679,
    "videoUrl": "https://www.youtube.com/embed/mYtll7r09Vc",
    "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyMSTHxwRvctqilxC_uRiBUT091sOyCRQXm-COchhNxDu3jfgYzYpArt61MmGY",
    "description": "끼숲소길 – 2만평 숲속 정원 드론으로의 카페 여행"
  },
  {
    "id": "1774636971960",
    "name": "제주빵집",
    "type": "cafe",
    "lat": 33.3932222,
    "lng": 126.3836225,
    "videoUrl": "https://www.youtube.com/embed/gQSgtEjeMZA",
    "imageUrl": "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTzMUxl4I6II8ydrUnfTFa1eG0OrVDdT5QMLBBe9XhHuBsy4XW_8ODLdDsPrk_D",
    "description": "제주빵집에서 드론 비행 시 탁 트인 목장 뷰를 담기 좋습니다"
  },
  {
    "id": "1774637179246",
    "name": "길갈팜랜드",
    "type": "tourist",
    "lat": 33.427439,
    "lng": 126.6722667,
    "videoUrl": "https://www.youtube.com/embed/DAzhHm8eoCE",
    "imageUrl": "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSvwcxzSjxyfL5hglfn-12NTC8J6Plq6yhcdfL8O-wXZeMiYFB7owoDFYH_Y82c",
    "description": "길갈 팜 랜드의 현재 운영 시간은 오전 10시부터 오후 5시 30분까지입니다. 방문 계획에 참고하세요."
  },
  {
    "id": "1774637528774",
    "name": "원앤온리카페",
    "type": "cafe",
    "lat": 33.2392241,
    "lng": 126.3193748,
    "videoUrl": "https://www.youtube.com/embed/aNNk6lyonmI",
    "imageUrl": "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQDgHO29HgRIlL5BzaYHfh79LT3mHe2r2sNDE3i9lOGLVoZOvhS5yLOBsN4PwYy",
    "description": "산방산 바로 아래 위치해 있어 드론 촬영 시 경관이 매우 훌륭합니다."
  },
  {
    "id": "1774637792975",
    "name": "소색채본",
    "type": "cafe",
    "lat": 33.2351057,
    "lng": 126.3134962,
    "videoUrl": "https://www.youtube.com/embed/2SIFQR0VI7w",
    "imageUrl": "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcS0YqpJlF5JvtfiZMot06Kiv_tEEiyrBqi4kNkCBn2grwoupfBeue1nQnveh2eu",
    "description": "소색채본은 산방산과 용머리해안 바다가 보이는 대형 베이커리 카페"
  }
];
