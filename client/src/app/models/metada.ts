export interface Metadata {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export type JsonResponse<T> = { status: 'success' | 'fail'; data: T };
