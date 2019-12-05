import request from '@/utils/request';

export async function query(): Promise<any> {
  return request('/api/user/list');
}

export async function queryCurrent(): Promise<any> {
  return request('/api/currentUser');
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
  
}
export async function getAllUsers(): Promise<any> {
  return request('/api/user/list');
}

export async function changeUserInfo(params: any): Promise<any>  {
  return request('/api/user/update', {
    method: 'POST',
    data: params,
  });
}