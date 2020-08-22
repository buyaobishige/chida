# favor 接口介绍

```ts
interface GetFavorData {
  openid: string;
  type: 'get';
}

type GetFavorCallback = number[];
```

```ts
interface AddFavorData {
  type: 'add';
  openid: string;
  id: number;
}

type AddFavorCallback = boolean;
```

```ts
interface DeleteFavorData {
  openid: string;
  type: 'delete';
  id: number;
}

type DeleteFavorCallback = boolean;
```

```ts
interface UpdateFavorData {
  openid: string;
  type: 'delete';
  data: number[];
}

type UpdateFavorCallback = boolean;
```
