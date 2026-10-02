# Hydration cleanup mutates `@let` values that are arrays

Angular 22.2, `provideClientHydration()`, SSR.

## Reproduce

```bash
yarn install
yarn ng serve
```

- `http://localhost:4200/frozen`: a frozen array of 7 frozen objects in a `@let`. The console shows
  `TypeError: Cannot add property i18nNodes, object is not extensible` at `cleanupI18nHydrationData`.
- `http://localhost:4200/mutable`: the same with plain objects. Click "Inspect items[6]" and you get
  `["id","i18nNodes","dehydratedIcuData"]`. Angular wrote two properties onto application data.

Conditions: the `@let` holds an array whose `[1]` is an object and `[6]` is an object, and the `@let` is read from a
child view (here the `@for` body). Otherwise the compiler does not store it in the LView.

## Cause

`cleanupDehydratedViews` → `cleanupLView` iterates `lView[HEADER_OFFSET .. tView.bindingStartIndex)` and recurses into
every slot passing `isLView(value)`, which is only `Array.isArray(value) && typeof value[TYPE] === 'object'`.
`ɵɵdeclareLet`/`ɵɵstoreLet` put `@let` values into that same slot range, so an array of objects is mistaken for an
LView, and `cleanupI18nHydrationData` writes `i18nNodes`/`dehydratedIcuData` onto `value[HYDRATION]` (= `value[6]`).

Frozen data is common with NgRx `strictStateImmutability`, where it throws in dev mode. In production the store objects
aren't frozen, so the store state is silently mutated.
