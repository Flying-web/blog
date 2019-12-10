import request from '@/utils/request';

export async function queryCatsList() {
  return request('/api/cats/list', {
  });
}

export interface catStates {
  title: string;
  name: string;
  content: string;
  type: string;
  poster: string;
}
export async function addCat(data: catStates) {
  return request('/api/cats/add', {
    method: 'POST',
    data,
  });
}
