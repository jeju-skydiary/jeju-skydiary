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
    id: '1',
    name: '성산일출봉',
    type: 'tourist',
    lat: 33.4581,
    lng: 126.9426,
    imageUrl: 'https://picsum.photos/seed/seongsan/400/300',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // 샘플 영상 (실제 드론 영상으로 교체 가능)
    description: '유네스코 세계자연유산으로 지정된 제주의 상징적인 명소입니다.'
  },
  {
    id: '2',
    name: '한라산 백록담',
    type: 'tourist',
    lat: 33.3617,
    lng: 126.5292,
    imageUrl: 'https://picsum.photos/seed/hallasan/400/300',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: '제주도 중앙에 위치한 대한민국에서 가장 높은 산입니다.'
  },
  {
    id: '3',
    name: '애월 카페거리',
    type: 'cafe',
    lat: 33.4624,
    lng: 126.3106,
    imageUrl: 'https://picsum.photos/seed/aewol/400/300',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: '에메랄드빛 바다를 보며 커피를 즐길 수 있는 핫플레이스입니다.'
  },
  {
    id: '4',
    name: '비자림',
    type: 'tourist',
    lat: 33.4839,
    lng: 126.7712,
    imageUrl: 'https://picsum.photos/seed/bijarim/400/300',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: '천 년의 세월을 간직한 비자나무 숲길입니다.'
  }
];
