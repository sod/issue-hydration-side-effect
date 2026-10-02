# Hydration cleanup mutates arrays stored in `@let` when the `@let` is read from a nested view

```bash
yarn install
yarn ng serve
```

- `http://localhost:4200/frozen`: the console shows
  `TypeError: Cannot add property i18nNodes, object is not extensible` at `cleanupI18nHydrationData`.
- `http://localhost:4200/mutable`: click "Inspect items[6]" and you get `["id","i18nNodes","dehydratedIcuData"]`.
