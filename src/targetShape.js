import { getPointBounds, pathLength, resamplePath } from './inkMorph.js';

// Generated from the reference doodle as dense horizontal ink segments.
export const TARGET_PATHS = [
  {
    id: 'reference-scan-001',
    points: [
      {
        x: 105.7,
        y: 4.1
      },
      {
        x: 118.5,
        y: 4.1
      }
    ]
  },
  {
    id: 'reference-scan-002',
    points: [
      {
        x: 101.7,
        y: 6.1
      },
      {
        x: 125.6,
        y: 6.1
      }
    ]
  },
  {
    id: 'reference-scan-003',
    points: [
      {
        x: 98.6,
        y: 8.1
      },
      {
        x: 107.1,
        y: 8.1
      }
    ]
  },
  {
    id: 'reference-scan-004',
    points: [
      {
        x: 117.2,
        y: 8.1
      },
      {
        x: 128.7,
        y: 8.1
      }
    ]
  },
  {
    id: 'reference-scan-005',
    points: [
      {
        x: 96.2,
        y: 10.1
      },
      {
        x: 103.3,
        y: 10.1
      }
    ]
  },
  {
    id: 'reference-scan-006',
    points: [
      {
        x: 117.2,
        y: 10.1
      },
      {
        x: 121.2,
        y: 10.1
      }
    ]
  },
  {
    id: 'reference-scan-007',
    points: [
      {
        x: 123.9,
        y: 10.1
      },
      {
        x: 130.7,
        y: 10.1
      }
    ]
  },
  {
    id: 'reference-scan-008',
    points: [
      {
        x: 94.2,
        y: 12.2
      },
      {
        x: 100.3,
        y: 12.2
      }
    ]
  },
  {
    id: 'reference-scan-009',
    points: [
      {
        x: 116.8,
        y: 12.2
      },
      {
        x: 121.2,
        y: 12.2
      }
    ]
  },
  {
    id: 'reference-scan-010',
    points: [
      {
        x: 127,
        y: 12.2
      },
      {
        x: 132,
        y: 12.2
      }
    ]
  },
  {
    id: 'reference-scan-011',
    points: [
      {
        x: 92.5,
        y: 14.2
      },
      {
        x: 98.3,
        y: 14.2
      }
    ]
  },
  {
    id: 'reference-scan-012',
    points: [
      {
        x: 116.5,
        y: 14.2
      },
      {
        x: 120.9,
        y: 14.2
      }
    ]
  },
  {
    id: 'reference-scan-013',
    points: [
      {
        x: 128.3,
        y: 14.2
      },
      {
        x: 133.1,
        y: 14.2
      }
    ]
  },
  {
    id: 'reference-scan-014',
    points: [
      {
        x: 91.2,
        y: 16.2
      },
      {
        x: 96.6,
        y: 16.2
      }
    ]
  },
  {
    id: 'reference-scan-015',
    points: [
      {
        x: 115.8,
        y: 16.2
      },
      {
        x: 120.2,
        y: 16.2
      }
    ]
  },
  {
    id: 'reference-scan-016',
    points: [
      {
        x: 129.3,
        y: 16.2
      },
      {
        x: 133.7,
        y: 16.2
      }
    ]
  },
  {
    id: 'reference-scan-017',
    points: [
      {
        x: 90.2,
        y: 18.2
      },
      {
        x: 94.9,
        y: 18.2
      }
    ]
  },
  {
    id: 'reference-scan-018',
    points: [
      {
        x: 115.5,
        y: 18.2
      },
      {
        x: 119.5,
        y: 18.2
      }
    ]
  },
  {
    id: 'reference-scan-019',
    points: [
      {
        x: 130,
        y: 18.2
      },
      {
        x: 134.4,
        y: 18.2
      }
    ]
  },
  {
    id: 'reference-scan-020',
    points: [
      {
        x: 89.2,
        y: 20.3
      },
      {
        x: 93.9,
        y: 20.3
      }
    ]
  },
  {
    id: 'reference-scan-021',
    points: [
      {
        x: 114.5,
        y: 20.3
      },
      {
        x: 118.9,
        y: 20.3
      }
    ]
  },
  {
    id: 'reference-scan-022',
    points: [
      {
        x: 130.4,
        y: 20.3
      },
      {
        x: 134.7,
        y: 20.3
      }
    ]
  },
  {
    id: 'reference-scan-023',
    points: [
      {
        x: 88.8,
        y: 22.3
      },
      {
        x: 93.2,
        y: 22.3
      }
    ]
  },
  {
    id: 'reference-scan-024',
    points: [
      {
        x: 113.5,
        y: 22.3
      },
      {
        x: 118.2,
        y: 22.3
      }
    ]
  },
  {
    id: 'reference-scan-025',
    points: [
      {
        x: 130.7,
        y: 22.3
      },
      {
        x: 135.1,
        y: 22.3
      }
    ]
  },
  {
    id: 'reference-scan-026',
    points: [
      {
        x: 88.5,
        y: 24.3
      },
      {
        x: 92.5,
        y: 24.3
      }
    ]
  },
  {
    id: 'reference-scan-027',
    points: [
      {
        x: 112.8,
        y: 24.3
      },
      {
        x: 117.2,
        y: 24.3
      }
    ]
  },
  {
    id: 'reference-scan-028',
    points: [
      {
        x: 131,
        y: 24.3
      },
      {
        x: 135.1,
        y: 24.3
      }
    ]
  },
  {
    id: 'reference-scan-029',
    points: [
      {
        x: 88.1,
        y: 26.3
      },
      {
        x: 93.2,
        y: 26.3
      }
    ]
  },
  {
    id: 'reference-scan-030',
    points: [
      {
        x: 112.8,
        y: 26.3
      },
      {
        x: 116.2,
        y: 26.3
      }
    ]
  },
  {
    id: 'reference-scan-031',
    points: [
      {
        x: 131,
        y: 26.3
      },
      {
        x: 135.1,
        y: 26.3
      }
    ]
  },
  {
    id: 'reference-scan-032',
    points: [
      {
        x: 87.5,
        y: 28.4
      },
      {
        x: 94.2,
        y: 28.4
      }
    ]
  },
  {
    id: 'reference-scan-033',
    points: [
      {
        x: 130.7,
        y: 28.4
      },
      {
        x: 135.1,
        y: 28.4
      }
    ]
  },
  {
    id: 'reference-scan-034',
    points: [
      {
        x: 86.8,
        y: 30.4
      },
      {
        x: 95.2,
        y: 30.4
      }
    ]
  },
  {
    id: 'reference-scan-035',
    points: [
      {
        x: 130.7,
        y: 30.4
      },
      {
        x: 134.7,
        y: 30.4
      }
    ]
  },
  {
    id: 'reference-scan-036',
    points: [
      {
        x: 86.1,
        y: 32.4
      },
      {
        x: 96.9,
        y: 32.4
      }
    ]
  },
  {
    id: 'reference-scan-037',
    points: [
      {
        x: 130,
        y: 32.4
      },
      {
        x: 134.4,
        y: 32.4
      }
    ]
  },
  {
    id: 'reference-scan-038',
    points: [
      {
        x: 85.4,
        y: 34.4
      },
      {
        x: 89.8,
        y: 34.4
      }
    ]
  },
  {
    id: 'reference-scan-039',
    points: [
      {
        x: 93.2,
        y: 34.4
      },
      {
        x: 99.3,
        y: 34.4
      }
    ]
  },
  {
    id: 'reference-scan-040',
    points: [
      {
        x: 129.7,
        y: 34.4
      },
      {
        x: 133.7,
        y: 34.4
      }
    ]
  },
  {
    id: 'reference-scan-041',
    points: [
      {
        x: 84.4,
        y: 36.5
      },
      {
        x: 89.2,
        y: 36.5
      }
    ]
  },
  {
    id: 'reference-scan-042',
    points: [
      {
        x: 94.9,
        y: 36.5
      },
      {
        x: 102,
        y: 36.5
      }
    ]
  },
  {
    id: 'reference-scan-043',
    points: [
      {
        x: 129,
        y: 36.5
      },
      {
        x: 133.4,
        y: 36.5
      }
    ]
  },
  {
    id: 'reference-scan-044',
    points: [
      {
        x: 83.8,
        y: 38.5
      },
      {
        x: 88.1,
        y: 38.5
      }
    ]
  },
  {
    id: 'reference-scan-045',
    points: [
      {
        x: 97.3,
        y: 38.5
      },
      {
        x: 105.7,
        y: 38.5
      }
    ]
  },
  {
    id: 'reference-scan-046',
    points: [
      {
        x: 128,
        y: 38.5
      },
      {
        x: 132.7,
        y: 38.5
      }
    ]
  },
  {
    id: 'reference-scan-047',
    points: [
      {
        x: 82.7,
        y: 40.5
      },
      {
        x: 87.5,
        y: 40.5
      }
    ]
  },
  {
    id: 'reference-scan-048',
    points: [
      {
        x: 100.3,
        y: 40.5
      },
      {
        x: 111.1,
        y: 40.5
      }
    ]
  },
  {
    id: 'reference-scan-049',
    points: [
      {
        x: 126.3,
        y: 40.5
      },
      {
        x: 131.4,
        y: 40.5
      }
    ]
  },
  {
    id: 'reference-scan-050',
    points: [
      {
        x: 81.7,
        y: 42.6
      },
      {
        x: 86.5,
        y: 42.6
      }
    ]
  },
  {
    id: 'reference-scan-051',
    points: [
      {
        x: 104,
        y: 42.6
      },
      {
        x: 130.4,
        y: 42.6
      }
    ]
  },
  {
    id: 'reference-scan-052',
    points: [
      {
        x: 80.7,
        y: 44.6
      },
      {
        x: 85.4,
        y: 44.6
      }
    ]
  },
  {
    id: 'reference-scan-053',
    points: [
      {
        x: 109.1,
        y: 44.6
      },
      {
        x: 128.3,
        y: 44.6
      }
    ]
  },
  {
    id: 'reference-scan-054',
    points: [
      {
        x: 80,
        y: 46.6
      },
      {
        x: 84.4,
        y: 46.6
      }
    ]
  },
  {
    id: 'reference-scan-055',
    points: [
      {
        x: 122.6,
        y: 46.6
      },
      {
        x: 127.3,
        y: 46.6
      }
    ]
  },
  {
    id: 'reference-scan-056',
    points: [
      {
        x: 79,
        y: 48.6
      },
      {
        x: 83.4,
        y: 48.6
      }
    ]
  },
  {
    id: 'reference-scan-057',
    points: [
      {
        x: 121.6,
        y: 48.6
      },
      {
        x: 126.3,
        y: 48.6
      }
    ]
  },
  {
    id: 'reference-scan-058',
    points: [
      {
        x: 78,
        y: 50.7
      },
      {
        x: 82.7,
        y: 50.7
      }
    ]
  },
  {
    id: 'reference-scan-059',
    points: [
      {
        x: 120.6,
        y: 50.7
      },
      {
        x: 125.3,
        y: 50.7
      }
    ]
  },
  {
    id: 'reference-scan-060',
    points: [
      {
        x: 76.7,
        y: 52.7
      },
      {
        x: 81.4,
        y: 52.7
      }
    ]
  },
  {
    id: 'reference-scan-061',
    points: [
      {
        x: 119.5,
        y: 52.7
      },
      {
        x: 124.3,
        y: 52.7
      }
    ]
  },
  {
    id: 'reference-scan-062',
    points: [
      {
        x: 76,
        y: 54.7
      },
      {
        x: 80.4,
        y: 54.7
      }
    ]
  },
  {
    id: 'reference-scan-063',
    points: [
      {
        x: 118.5,
        y: 54.7
      },
      {
        x: 123.3,
        y: 54.7
      }
    ]
  },
  {
    id: 'reference-scan-064',
    points: [
      {
        x: 74.6,
        y: 56.7
      },
      {
        x: 79.4,
        y: 56.7
      }
    ]
  },
  {
    id: 'reference-scan-065',
    points: [
      {
        x: 117.5,
        y: 56.7
      },
      {
        x: 122.3,
        y: 56.7
      }
    ]
  },
  {
    id: 'reference-scan-066',
    points: [
      {
        x: 73.6,
        y: 58.8
      },
      {
        x: 78.3,
        y: 58.8
      }
    ]
  },
  {
    id: 'reference-scan-067',
    points: [
      {
        x: 116.5,
        y: 58.8
      },
      {
        x: 120.9,
        y: 58.8
      }
    ]
  },
  {
    id: 'reference-scan-068',
    points: [
      {
        x: 72.6,
        y: 60.8
      },
      {
        x: 77.3,
        y: 60.8
      }
    ]
  },
  {
    id: 'reference-scan-069',
    points: [
      {
        x: 115.5,
        y: 60.8
      },
      {
        x: 120.2,
        y: 60.8
      }
    ]
  },
  {
    id: 'reference-scan-070',
    points: [
      {
        x: 71.3,
        y: 62.8
      },
      {
        x: 76,
        y: 62.8
      }
    ]
  },
  {
    id: 'reference-scan-071',
    points: [
      {
        x: 87.5,
        y: 62.8
      },
      {
        x: 90.5,
        y: 62.8
      }
    ]
  },
  {
    id: 'reference-scan-072',
    points: [
      {
        x: 114.5,
        y: 62.8
      },
      {
        x: 118.9,
        y: 62.8
      }
    ]
  },
  {
    id: 'reference-scan-073',
    points: [
      {
        x: 70.2,
        y: 64.8
      },
      {
        x: 75,
        y: 64.8
      }
    ]
  },
  {
    id: 'reference-scan-074',
    points: [
      {
        x: 86.8,
        y: 64.8
      },
      {
        x: 91.2,
        y: 64.8
      }
    ]
  },
  {
    id: 'reference-scan-075',
    points: [
      {
        x: 113.5,
        y: 64.8
      },
      {
        x: 117.9,
        y: 64.8
      }
    ]
  },
  {
    id: 'reference-scan-076',
    points: [
      {
        x: 68.9,
        y: 66.9
      },
      {
        x: 74,
        y: 66.9
      }
    ]
  },
  {
    id: 'reference-scan-077',
    points: [
      {
        x: 88.1,
        y: 66.9
      },
      {
        x: 89.8,
        y: 66.9
      }
    ]
  },
  {
    id: 'reference-scan-078',
    points: [
      {
        x: 94.9,
        y: 66.9
      },
      {
        x: 98.6,
        y: 66.9
      }
    ]
  },
  {
    id: 'reference-scan-079',
    points: [
      {
        x: 112.1,
        y: 66.9
      },
      {
        x: 116.8,
        y: 66.9
      }
    ]
  },
  {
    id: 'reference-scan-080',
    points: [
      {
        x: 67.9,
        y: 68.9
      },
      {
        x: 72.6,
        y: 68.9
      }
    ]
  },
  {
    id: 'reference-scan-081',
    points: [
      {
        x: 94.6,
        y: 68.9
      },
      {
        x: 98.9,
        y: 68.9
      }
    ]
  },
  {
    id: 'reference-scan-082',
    points: [
      {
        x: 111.1,
        y: 68.9
      },
      {
        x: 115.8,
        y: 68.9
      }
    ]
  },
  {
    id: 'reference-scan-083',
    points: [
      {
        x: 66.5,
        y: 70.9
      },
      {
        x: 71.6,
        y: 70.9
      }
    ]
  },
  {
    id: 'reference-scan-084',
    points: [
      {
        x: 83.4,
        y: 70.9
      },
      {
        x: 88.8,
        y: 70.9
      }
    ]
  },
  {
    id: 'reference-scan-085',
    points: [
      {
        x: 110.1,
        y: 70.9
      },
      {
        x: 114.8,
        y: 70.9
      }
    ]
  },
  {
    id: 'reference-scan-086',
    points: [
      {
        x: 65.5,
        y: 72.9
      },
      {
        x: 70.2,
        y: 72.9
      }
    ]
  },
  {
    id: 'reference-scan-087',
    points: [
      {
        x: 84.4,
        y: 72.9
      },
      {
        x: 95.6,
        y: 72.9
      }
    ]
  },
  {
    id: 'reference-scan-088',
    points: [
      {
        x: 109.1,
        y: 72.9
      },
      {
        x: 113.8,
        y: 72.9
      }
    ]
  },
  {
    id: 'reference-scan-089',
    points: [
      {
        x: 64.2,
        y: 75
      },
      {
        x: 68.9,
        y: 75
      }
    ]
  },
  {
    id: 'reference-scan-090',
    points: [
      {
        x: 87.5,
        y: 75
      },
      {
        x: 96.6,
        y: 75
      }
    ]
  },
  {
    id: 'reference-scan-091',
    points: [
      {
        x: 108.1,
        y: 75
      },
      {
        x: 112.8,
        y: 75
      }
    ]
  },
  {
    id: 'reference-scan-092',
    points: [
      {
        x: 62.8,
        y: 77
      },
      {
        x: 67.5,
        y: 77
      }
    ]
  },
  {
    id: 'reference-scan-093',
    points: [
      {
        x: 93.5,
        y: 77
      },
      {
        x: 94.9,
        y: 77
      }
    ]
  },
  {
    id: 'reference-scan-094',
    points: [
      {
        x: 107.1,
        y: 77
      },
      {
        x: 111.8,
        y: 77
      }
    ]
  },
  {
    id: 'reference-scan-095',
    points: [
      {
        x: 29.4,
        y: 79
      },
      {
        x: 33.8,
        y: 79
      }
    ]
  },
  {
    id: 'reference-scan-096',
    points: [
      {
        x: 61.5,
        y: 79
      },
      {
        x: 66.5,
        y: 79
      }
    ]
  },
  {
    id: 'reference-scan-097',
    points: [
      {
        x: 105.7,
        y: 79
      },
      {
        x: 110.4,
        y: 79
      }
    ]
  },
  {
    id: 'reference-scan-098',
    points: [
      {
        x: 30.1,
        y: 81.1
      },
      {
        x: 34.4,
        y: 81.1
      }
    ]
  },
  {
    id: 'reference-scan-099',
    points: [
      {
        x: 60.1,
        y: 81.1
      },
      {
        x: 65.2,
        y: 81.1
      }
    ]
  },
  {
    id: 'reference-scan-100',
    points: [
      {
        x: 104.7,
        y: 81.1
      },
      {
        x: 109.4,
        y: 81.1
      }
    ]
  },
  {
    id: 'reference-scan-101',
    points: [
      {
        x: 30.7,
        y: 83.1
      },
      {
        x: 35.1,
        y: 83.1
      }
    ]
  },
  {
    id: 'reference-scan-102',
    points: [
      {
        x: 58.8,
        y: 83.1
      },
      {
        x: 63.8,
        y: 83.1
      }
    ]
  },
  {
    id: 'reference-scan-103',
    points: [
      {
        x: 103.7,
        y: 83.1
      },
      {
        x: 108.4,
        y: 83.1
      }
    ]
  },
  {
    id: 'reference-scan-104',
    points: [
      {
        x: 25,
        y: 85.1
      },
      {
        x: 41.9,
        y: 85.1
      }
    ]
  },
  {
    id: 'reference-scan-105',
    points: [
      {
        x: 57.4,
        y: 85.1
      },
      {
        x: 62.5,
        y: 85.1
      }
    ]
  },
  {
    id: 'reference-scan-106',
    points: [
      {
        x: 102.7,
        y: 85.1
      },
      {
        x: 107.4,
        y: 85.1
      }
    ]
  },
  {
    id: 'reference-scan-107',
    points: [
      {
        x: 20.9,
        y: 87.1
      },
      {
        x: 45.6,
        y: 87.1
      }
    ]
  },
  {
    id: 'reference-scan-108',
    points: [
      {
        x: 56.1,
        y: 87.1
      },
      {
        x: 61.1,
        y: 87.1
      }
    ]
  },
  {
    id: 'reference-scan-109',
    points: [
      {
        x: 101.7,
        y: 87.1
      },
      {
        x: 106.4,
        y: 87.1
      }
    ]
  },
  {
    id: 'reference-scan-110',
    points: [
      {
        x: 17.9,
        y: 89.2
      },
      {
        x: 26.3,
        y: 89.2
      }
    ]
  },
  {
    id: 'reference-scan-111',
    points: [
      {
        x: 40.2,
        y: 89.2
      },
      {
        x: 48.6,
        y: 89.2
      }
    ]
  },
  {
    id: 'reference-scan-112',
    points: [
      {
        x: 54.7,
        y: 89.2
      },
      {
        x: 59.8,
        y: 89.2
      }
    ]
  },
  {
    id: 'reference-scan-113',
    points: [
      {
        x: 100.3,
        y: 89.2
      },
      {
        x: 105,
        y: 89.2
      }
    ]
  },
  {
    id: 'reference-scan-114',
    points: [
      {
        x: 15.5,
        y: 91.2
      },
      {
        x: 22.3,
        y: 91.2
      }
    ]
  },
  {
    id: 'reference-scan-115',
    points: [
      {
        x: 44.2,
        y: 91.2
      },
      {
        x: 51,
        y: 91.2
      }
    ]
  },
  {
    id: 'reference-scan-116',
    points: [
      {
        x: 53,
        y: 91.2
      },
      {
        x: 58.4,
        y: 91.2
      }
    ]
  },
  {
    id: 'reference-scan-117',
    points: [
      {
        x: 99.3,
        y: 91.2
      },
      {
        x: 104,
        y: 91.2
      }
    ]
  },
  {
    id: 'reference-scan-118',
    points: [
      {
        x: 13.5,
        y: 93.2
      },
      {
        x: 19.6,
        y: 93.2
      }
    ]
  },
  {
    id: 'reference-scan-119',
    points: [
      {
        x: 46.9,
        y: 93.2
      },
      {
        x: 56.7,
        y: 93.2
      }
    ]
  },
  {
    id: 'reference-scan-120',
    points: [
      {
        x: 97.9,
        y: 93.2
      },
      {
        x: 102.7,
        y: 93.2
      }
    ]
  },
  {
    id: 'reference-scan-121',
    points: [
      {
        x: 12.2,
        y: 95.2
      },
      {
        x: 17.6,
        y: 95.2
      }
    ]
  },
  {
    id: 'reference-scan-122',
    points: [
      {
        x: 49,
        y: 95.2
      },
      {
        x: 55.4,
        y: 95.2
      }
    ]
  },
  {
    id: 'reference-scan-123',
    points: [
      {
        x: 96.9,
        y: 95.2
      },
      {
        x: 101.7,
        y: 95.2
      }
    ]
  },
  {
    id: 'reference-scan-124',
    points: [
      {
        x: 4.1,
        y: 97.3
      },
      {
        x: 7.4,
        y: 97.3
      }
    ]
  },
  {
    id: 'reference-scan-125',
    points: [
      {
        x: 10.5,
        y: 97.3
      },
      {
        x: 15.9,
        y: 97.3
      }
    ]
  },
  {
    id: 'reference-scan-126',
    points: [
      {
        x: 25.7,
        y: 97.3
      },
      {
        x: 29.4,
        y: 97.3
      }
    ]
  },
  {
    id: 'reference-scan-127',
    points: [
      {
        x: 51,
        y: 97.3
      },
      {
        x: 53.7,
        y: 97.3
      }
    ]
  },
  {
    id: 'reference-scan-128',
    points: [
      {
        x: 95.6,
        y: 97.3
      },
      {
        x: 100.6,
        y: 97.3
      }
    ]
  },
  {
    id: 'reference-scan-129',
    points: [
      {
        x: 2.7,
        y: 99.3
      },
      {
        x: 14.5,
        y: 99.3
      }
    ]
  },
  {
    id: 'reference-scan-130',
    points: [
      {
        x: 25.7,
        y: 99.3
      },
      {
        x: 30.7,
        y: 99.3
      }
    ]
  },
  {
    id: 'reference-scan-131',
    points: [
      {
        x: 94.6,
        y: 99.3
      },
      {
        x: 99.3,
        y: 99.3
      }
    ]
  },
  {
    id: 'reference-scan-132',
    points: [
      {
        x: 3.7,
        y: 101.3
      },
      {
        x: 13.2,
        y: 101.3
      }
    ]
  },
  {
    id: 'reference-scan-133',
    points: [
      {
        x: 27,
        y: 101.3
      },
      {
        x: 31.7,
        y: 101.3
      }
    ]
  },
  {
    id: 'reference-scan-134',
    points: [
      {
        x: 42.6,
        y: 101.3
      },
      {
        x: 46.3,
        y: 101.3
      }
    ]
  },
  {
    id: 'reference-scan-135',
    points: [
      {
        x: 93.2,
        y: 101.3
      },
      {
        x: 98.3,
        y: 101.3
      }
    ]
  },
  {
    id: 'reference-scan-136',
    points: [
      {
        x: 7.8,
        y: 103.3
      },
      {
        x: 12.2,
        y: 103.3
      }
    ]
  },
  {
    id: 'reference-scan-137',
    points: [
      {
        x: 28,
        y: 103.3
      },
      {
        x: 32.1,
        y: 103.3
      }
    ]
  },
  {
    id: 'reference-scan-138',
    points: [
      {
        x: 41.2,
        y: 103.3
      },
      {
        x: 46.3,
        y: 103.3
      }
    ]
  },
  {
    id: 'reference-scan-139',
    points: [
      {
        x: 92.2,
        y: 103.3
      },
      {
        x: 96.9,
        y: 103.3
      }
    ]
  },
  {
    id: 'reference-scan-140',
    points: [
      {
        x: 7.1,
        y: 105.4
      },
      {
        x: 11.5,
        y: 105.4
      }
    ]
  },
  {
    id: 'reference-scan-141',
    points: [
      {
        x: 39.5,
        y: 105.4
      },
      {
        x: 44.9,
        y: 105.4
      }
    ]
  },
  {
    id: 'reference-scan-142',
    points: [
      {
        x: 90.8,
        y: 105.4
      },
      {
        x: 95.9,
        y: 105.4
      }
    ]
  },
  {
    id: 'reference-scan-143',
    points: [
      {
        x: 6.4,
        y: 107.4
      },
      {
        x: 10.8,
        y: 107.4
      }
    ]
  },
  {
    id: 'reference-scan-144',
    points: [
      {
        x: 39.8,
        y: 107.4
      },
      {
        x: 43.2,
        y: 107.4
      }
    ]
  },
  {
    id: 'reference-scan-145',
    points: [
      {
        x: 89.5,
        y: 107.4
      },
      {
        x: 94.6,
        y: 107.4
      }
    ]
  },
  {
    id: 'reference-scan-146',
    points: [
      {
        x: 6.1,
        y: 109.4
      },
      {
        x: 10.5,
        y: 109.4
      }
    ]
  },
  {
    id: 'reference-scan-147',
    points: [
      {
        x: 88.1,
        y: 109.4
      },
      {
        x: 93.2,
        y: 109.4
      }
    ]
  },
  {
    id: 'reference-scan-148',
    points: [
      {
        x: 6.1,
        y: 111.4
      },
      {
        x: 10.1,
        y: 111.4
      }
    ]
  },
  {
    id: 'reference-scan-149',
    points: [
      {
        x: 86.8,
        y: 111.4
      },
      {
        x: 91.9,
        y: 111.4
      }
    ]
  },
  {
    id: 'reference-scan-150',
    points: [
      {
        x: 5.7,
        y: 113.5
      },
      {
        x: 10.1,
        y: 113.5
      }
    ]
  },
  {
    id: 'reference-scan-151',
    points: [
      {
        x: 18.9,
        y: 113.5
      },
      {
        x: 25.7,
        y: 113.5
      }
    ]
  },
  {
    id: 'reference-scan-152',
    points: [
      {
        x: 85.4,
        y: 113.5
      },
      {
        x: 90.5,
        y: 113.5
      }
    ]
  },
  {
    id: 'reference-scan-153',
    points: [
      {
        x: 5.7,
        y: 115.5
      },
      {
        x: 9.8,
        y: 115.5
      }
    ]
  },
  {
    id: 'reference-scan-154',
    points: [
      {
        x: 17.2,
        y: 115.5
      },
      {
        x: 26.7,
        y: 115.5
      }
    ]
  },
  {
    id: 'reference-scan-155',
    points: [
      {
        x: 84.1,
        y: 115.5
      },
      {
        x: 90.2,
        y: 115.5
      }
    ]
  },
  {
    id: 'reference-scan-156',
    points: [
      {
        x: 5.7,
        y: 117.5
      },
      {
        x: 10.1,
        y: 117.5
      }
    ]
  },
  {
    id: 'reference-scan-157',
    points: [
      {
        x: 17.9,
        y: 117.5
      },
      {
        x: 21.6,
        y: 117.5
      }
    ]
  },
  {
    id: 'reference-scan-158',
    points: [
      {
        x: 23.6,
        y: 117.5
      },
      {
        x: 25.3,
        y: 117.5
      }
    ]
  },
  {
    id: 'reference-scan-159',
    points: [
      {
        x: 41.9,
        y: 117.5
      },
      {
        x: 50.7,
        y: 117.5
      }
    ]
  },
  {
    id: 'reference-scan-160',
    points: [
      {
        x: 84.4,
        y: 117.5
      },
      {
        x: 94.2,
        y: 117.5
      }
    ]
  },
  {
    id: 'reference-scan-161',
    points: [
      {
        x: 6.1,
        y: 119.5
      },
      {
        x: 10.5,
        y: 119.5
      }
    ]
  },
  {
    id: 'reference-scan-162',
    points: [
      {
        x: 42.6,
        y: 119.5
      },
      {
        x: 52,
        y: 119.5
      }
    ]
  },
  {
    id: 'reference-scan-163',
    points: [
      {
        x: 88.5,
        y: 119.5
      },
      {
        x: 96.9,
        y: 119.5
      }
    ]
  },
  {
    id: 'reference-scan-164',
    points: [
      {
        x: 6.4,
        y: 121.6
      },
      {
        x: 10.8,
        y: 121.6
      }
    ]
  },
  {
    id: 'reference-scan-165',
    points: [
      {
        x: 92.5,
        y: 121.6
      },
      {
        x: 98.9,
        y: 121.6
      }
    ]
  },
  {
    id: 'reference-scan-166',
    points: [
      {
        x: 7.1,
        y: 123.6
      },
      {
        x: 11.5,
        y: 123.6
      }
    ]
  },
  {
    id: 'reference-scan-167',
    points: [
      {
        x: 31.1,
        y: 123.6
      },
      {
        x: 35.1,
        y: 123.6
      }
    ]
  },
  {
    id: 'reference-scan-168',
    points: [
      {
        x: 94.9,
        y: 123.6
      },
      {
        x: 100.6,
        y: 123.6
      }
    ]
  },
  {
    id: 'reference-scan-169',
    points: [
      {
        x: 7.8,
        y: 125.6
      },
      {
        x: 12.5,
        y: 125.6
      }
    ]
  },
  {
    id: 'reference-scan-170',
    points: [
      {
        x: 30.7,
        y: 125.6
      },
      {
        x: 35.1,
        y: 125.6
      }
    ]
  },
  {
    id: 'reference-scan-171',
    points: [
      {
        x: 75,
        y: 125.6
      },
      {
        x: 79,
        y: 125.6
      }
    ]
  },
  {
    id: 'reference-scan-172',
    points: [
      {
        x: 96.9,
        y: 125.6
      },
      {
        x: 108.7,
        y: 125.6
      }
    ]
  },
  {
    id: 'reference-scan-173',
    points: [
      {
        x: 6.8,
        y: 127.7
      },
      {
        x: 13.5,
        y: 127.7
      }
    ]
  },
  {
    id: 'reference-scan-174',
    points: [
      {
        x: 31.1,
        y: 127.7
      },
      {
        x: 35.5,
        y: 127.7
      }
    ]
  },
  {
    id: 'reference-scan-175',
    points: [
      {
        x: 74.3,
        y: 127.7
      },
      {
        x: 78.7,
        y: 127.7
      }
    ]
  },
  {
    id: 'reference-scan-176',
    points: [
      {
        x: 98.6,
        y: 127.7
      },
      {
        x: 109.4,
        y: 127.7
      }
    ]
  },
  {
    id: 'reference-scan-177',
    points: [
      {
        x: 4.4,
        y: 129.7
      },
      {
        x: 15.2,
        y: 129.7
      }
    ]
  },
  {
    id: 'reference-scan-178',
    points: [
      {
        x: 31.4,
        y: 129.7
      },
      {
        x: 35.5,
        y: 129.7
      }
    ]
  },
  {
    id: 'reference-scan-179',
    points: [
      {
        x: 74.3,
        y: 129.7
      },
      {
        x: 78.7,
        y: 129.7
      }
    ]
  },
  {
    id: 'reference-scan-180',
    points: [
      {
        x: 99.6,
        y: 129.7
      },
      {
        x: 105,
        y: 129.7
      }
    ]
  },
  {
    id: 'reference-scan-181',
    points: [
      {
        x: 4.1,
        y: 131.7
      },
      {
        x: 8.4,
        y: 131.7
      }
    ]
  },
  {
    id: 'reference-scan-182',
    points: [
      {
        x: 11.5,
        y: 131.7
      },
      {
        x: 17.2,
        y: 131.7
      }
    ]
  },
  {
    id: 'reference-scan-183',
    points: [
      {
        x: 74.6,
        y: 131.7
      },
      {
        x: 78.7,
        y: 131.7
      }
    ]
  },
  {
    id: 'reference-scan-184',
    points: [
      {
        x: 100.6,
        y: 131.7
      },
      {
        x: 105,
        y: 131.7
      }
    ]
  },
  {
    id: 'reference-scan-185',
    points: [
      {
        x: 13.2,
        y: 133.7
      },
      {
        x: 19.6,
        y: 133.7
      }
    ]
  },
  {
    id: 'reference-scan-186',
    points: [
      {
        x: 89.5,
        y: 133.7
      },
      {
        x: 93.2,
        y: 133.7
      }
    ]
  },
  {
    id: 'reference-scan-187',
    points: [
      {
        x: 101.3,
        y: 133.7
      },
      {
        x: 105.7,
        y: 133.7
      }
    ]
  },
  {
    id: 'reference-scan-188',
    points: [
      {
        x: 15.2,
        y: 135.8
      },
      {
        x: 23.3,
        y: 135.8
      }
    ]
  },
  {
    id: 'reference-scan-189',
    points: [
      {
        x: 60.8,
        y: 135.8
      },
      {
        x: 63.2,
        y: 135.8
      }
    ]
  },
  {
    id: 'reference-scan-190',
    points: [
      {
        x: 85.4,
        y: 135.8
      },
      {
        x: 94.6,
        y: 135.8
      }
    ]
  },
  {
    id: 'reference-scan-191',
    points: [
      {
        x: 101.7,
        y: 135.8
      },
      {
        x: 106,
        y: 135.8
      }
    ]
  },
  {
    id: 'reference-scan-192',
    points: [
      {
        x: 17.9,
        y: 137.8
      },
      {
        x: 29.4,
        y: 137.8
      }
    ]
  },
  {
    id: 'reference-scan-193',
    points: [
      {
        x: 45.3,
        y: 137.8
      },
      {
        x: 50.7,
        y: 137.8
      }
    ]
  },
  {
    id: 'reference-scan-194',
    points: [
      {
        x: 59.8,
        y: 137.8
      },
      {
        x: 66.5,
        y: 137.8
      }
    ]
  },
  {
    id: 'reference-scan-195',
    points: [
      {
        x: 85.4,
        y: 137.8
      },
      {
        x: 93.2,
        y: 137.8
      }
    ]
  },
  {
    id: 'reference-scan-196',
    points: [
      {
        x: 102,
        y: 137.8
      },
      {
        x: 106.4,
        y: 137.8
      }
    ]
  },
  {
    id: 'reference-scan-197',
    points: [
      {
        x: 21.6,
        y: 139.8
      },
      {
        x: 51.3,
        y: 139.8
      }
    ]
  },
  {
    id: 'reference-scan-198',
    points: [
      {
        x: 61.5,
        y: 139.8
      },
      {
        x: 69.2,
        y: 139.8
      }
    ]
  },
  {
    id: 'reference-scan-199',
    points: [
      {
        x: 102.3,
        y: 139.8
      },
      {
        x: 106.4,
        y: 139.8
      }
    ]
  },
  {
    id: 'reference-scan-200',
    points: [
      {
        x: 27,
        y: 141.8
      },
      {
        x: 51.7,
        y: 141.8
      }
    ]
  },
  {
    id: 'reference-scan-201',
    points: [
      {
        x: 64.8,
        y: 141.8
      },
      {
        x: 68.9,
        y: 141.8
      }
    ]
  },
  {
    id: 'reference-scan-202',
    points: [
      {
        x: 102.3,
        y: 141.8
      },
      {
        x: 106.7,
        y: 141.8
      }
    ]
  },
  {
    id: 'reference-scan-203',
    points: [
      {
        x: 27,
        y: 143.9
      },
      {
        x: 31.1,
        y: 143.9
      }
    ]
  },
  {
    id: 'reference-scan-204',
    points: [
      {
        x: 48,
        y: 143.9
      },
      {
        x: 52.3,
        y: 143.9
      }
    ]
  },
  {
    id: 'reference-scan-205',
    points: [
      {
        x: 102.3,
        y: 143.9
      },
      {
        x: 106.4,
        y: 143.9
      }
    ]
  },
  {
    id: 'reference-scan-206',
    points: [
      {
        x: 26.7,
        y: 145.9
      },
      {
        x: 30.7,
        y: 145.9
      }
    ]
  },
  {
    id: 'reference-scan-207',
    points: [
      {
        x: 48.3,
        y: 145.9
      },
      {
        x: 52.7,
        y: 145.9
      }
    ]
  },
  {
    id: 'reference-scan-208',
    points: [
      {
        x: 102,
        y: 145.9
      },
      {
        x: 106.4,
        y: 145.9
      }
    ]
  },
  {
    id: 'reference-scan-209',
    points: [
      {
        x: 27.7,
        y: 147.9
      },
      {
        x: 29.7,
        y: 147.9
      }
    ]
  },
  {
    id: 'reference-scan-210',
    points: [
      {
        x: 49,
        y: 147.9
      },
      {
        x: 53,
        y: 147.9
      }
    ]
  },
  {
    id: 'reference-scan-211',
    points: [
      {
        x: 83.8,
        y: 147.9
      },
      {
        x: 88.5,
        y: 147.9
      }
    ]
  },
  {
    id: 'reference-scan-212',
    points: [
      {
        x: 101.7,
        y: 147.9
      },
      {
        x: 106,
        y: 147.9
      }
    ]
  },
  {
    id: 'reference-scan-213',
    points: [
      {
        x: 49.3,
        y: 149.9
      },
      {
        x: 53.7,
        y: 149.9
      }
    ]
  },
  {
    id: 'reference-scan-214',
    points: [
      {
        x: 71.9,
        y: 149.9
      },
      {
        x: 74.3,
        y: 149.9
      }
    ]
  },
  {
    id: 'reference-scan-215',
    points: [
      {
        x: 84.1,
        y: 149.9
      },
      {
        x: 90.8,
        y: 149.9
      }
    ]
  },
  {
    id: 'reference-scan-216',
    points: [
      {
        x: 101.3,
        y: 149.9
      },
      {
        x: 105.7,
        y: 149.9
      }
    ]
  },
  {
    id: 'reference-scan-217',
    points: [
      {
        x: 50,
        y: 152
      },
      {
        x: 54.4,
        y: 152
      }
    ]
  },
  {
    id: 'reference-scan-218',
    points: [
      {
        x: 70.9,
        y: 152
      },
      {
        x: 75.3,
        y: 152
      }
    ]
  },
  {
    id: 'reference-scan-219',
    points: [
      {
        x: 86.8,
        y: 152
      },
      {
        x: 92.2,
        y: 152
      }
    ]
  },
  {
    id: 'reference-scan-220',
    points: [
      {
        x: 100.6,
        y: 152
      },
      {
        x: 105,
        y: 152
      }
    ]
  },
  {
    id: 'reference-scan-221',
    points: [
      {
        x: 50.7,
        y: 154
      },
      {
        x: 55.4,
        y: 154
      }
    ]
  },
  {
    id: 'reference-scan-222',
    points: [
      {
        x: 70.2,
        y: 154
      },
      {
        x: 74.6,
        y: 154
      }
    ]
  },
  {
    id: 'reference-scan-223',
    points: [
      {
        x: 89.2,
        y: 154
      },
      {
        x: 90.8,
        y: 154
      }
    ]
  },
  {
    id: 'reference-scan-224',
    points: [
      {
        x: 99.6,
        y: 154
      },
      {
        x: 104,
        y: 154
      }
    ]
  },
  {
    id: 'reference-scan-225',
    points: [
      {
        x: 51.7,
        y: 156
      },
      {
        x: 56.4,
        y: 156
      }
    ]
  },
  {
    id: 'reference-scan-226',
    points: [
      {
        x: 68.9,
        y: 156
      },
      {
        x: 74,
        y: 156
      }
    ]
  },
  {
    id: 'reference-scan-227',
    points: [
      {
        x: 98.6,
        y: 156
      },
      {
        x: 103.3,
        y: 156
      }
    ]
  },
  {
    id: 'reference-scan-228',
    points: [
      {
        x: 52.7,
        y: 158
      },
      {
        x: 57.7,
        y: 158
      }
    ]
  },
  {
    id: 'reference-scan-229',
    points: [
      {
        x: 69.2,
        y: 158
      },
      {
        x: 72.6,
        y: 158
      }
    ]
  },
  {
    id: 'reference-scan-230',
    points: [
      {
        x: 96.9,
        y: 158
      },
      {
        x: 104.7,
        y: 158
      }
    ]
  },
  {
    id: 'reference-scan-231',
    points: [
      {
        x: 48.6,
        y: 160.1
      },
      {
        x: 59.4,
        y: 160.1
      }
    ]
  },
  {
    id: 'reference-scan-232',
    points: [
      {
        x: 95.2,
        y: 160.1
      },
      {
        x: 106,
        y: 160.1
      }
    ]
  },
  {
    id: 'reference-scan-233',
    points: [
      {
        x: 48.6,
        y: 162.1
      },
      {
        x: 61.5,
        y: 162.1
      }
    ]
  },
  {
    id: 'reference-scan-234',
    points: [
      {
        x: 92.5,
        y: 162.1
      },
      {
        x: 98.9,
        y: 162.1
      }
    ]
  },
  {
    id: 'reference-scan-235',
    points: [
      {
        x: 102.3,
        y: 162.1
      },
      {
        x: 106.4,
        y: 162.1
      }
    ]
  },
  {
    id: 'reference-scan-236',
    points: [
      {
        x: 57.4,
        y: 164.1
      },
      {
        x: 64.5,
        y: 164.1
      }
    ]
  },
  {
    id: 'reference-scan-237',
    points: [
      {
        x: 88.8,
        y: 164.1
      },
      {
        x: 96.9,
        y: 164.1
      }
    ]
  },
  {
    id: 'reference-scan-238',
    points: [
      {
        x: 59.8,
        y: 166.2
      },
      {
        x: 70.9,
        y: 166.2
      }
    ]
  },
  {
    id: 'reference-scan-239',
    points: [
      {
        x: 81.4,
        y: 166.2
      },
      {
        x: 94.2,
        y: 166.2
      }
    ]
  },
  {
    id: 'reference-scan-240',
    points: [
      {
        x: 63.2,
        y: 168.2
      },
      {
        x: 90.2,
        y: 168.2
      }
    ]
  },
  {
    id: 'reference-scan-241',
    points: [
      {
        x: 68.9,
        y: 170.2
      },
      {
        x: 83.4,
        y: 170.2
      }
    ]
  },
  {
    id: 'reference-scan-242',
    points: [
      {
        x: 78.3,
        y: 172.2
      },
      {
        x: 82.7,
        y: 172.2
      }
    ]
  },
  {
    id: 'reference-scan-243',
    points: [
      {
        x: 77.7,
        y: 174.3
      },
      {
        x: 82.1,
        y: 174.3
      }
    ]
  },
  {
    id: 'reference-scan-244',
    points: [
      {
        x: 78.3,
        y: 176.3
      },
      {
        x: 81.4,
        y: 176.3
      }
    ]
  }
];

export function getTargetBounds(paths = TARGET_PATHS) {
  return getPointBounds(paths.flatMap((path) => path.points));
}

export function sampleTargetPaths(totalSamples) {
  if (totalSamples <= 0) {
    return [];
  }

  const drawablePaths = TARGET_PATHS.filter((path) => path.points.length > 1);
  const lengths = drawablePaths.map((path) => Math.max(0.000001, pathLength(path.points)));
  const totalLength = lengths.reduce((sum, length) => sum + length, 0);
  const allocations = allocateTargetSamples(lengths, totalLength, totalSamples);
  const samples = [];

  drawablePaths.forEach((path, pathIndex) => {
    const pathSamples = resamplePath(path.points, allocations[pathIndex]);

    pathSamples.forEach((point) => {
      samples.push({
        ...point,
        pathId: path.id,
        sequence: samples.length,
      });
    });
  });

  return samples;
}

function allocateTargetSamples(lengths, totalLength, totalSamples) {
  const minimumPerPath = totalSamples >= lengths.length * 2 ? 2 : 0;
  const allocations = lengths.map(() => minimumPerPath);
  let remaining = totalSamples - allocations.reduce((sum, value) => sum + value, 0);

  const rawAllocations = lengths.map((length) => (length / totalLength) * remaining);
  const rankedFractions = rawAllocations
    .map((value, index) => ({
      index,
      fraction: value - Math.floor(value),
      length: lengths[index],
    }))
    .sort((a, b) => b.fraction - a.fraction || b.length - a.length || a.index - b.index);

  rawAllocations.forEach((value, index) => {
    allocations[index] += Math.floor(value);
  });

  remaining = totalSamples - allocations.reduce((sum, value) => sum + value, 0);

  let rankIndex = 0;
  while (remaining > 0) {
    allocations[rankedFractions[rankIndex % rankedFractions.length].index] += 1;
    remaining -= 1;
    rankIndex += 1;
  }

  return allocations;
}
