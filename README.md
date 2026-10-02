# Hydration cleanup mutates arrays stored in `@let` when the `@let` is read from a nested view

Angular 22.2, `provideClientHydration()`, SSR.

If a `@let` holding an array is read inside a nested block, hydration cleanup mistakes that array for an internal view
and writes two properties onto its 7th element.

## Conditions

All of these must hold:

1. The page is hydrated (SSR + `provideClientHydration()`).
2. The `@let` is read from a nested view (`@for`, `@if`, `@switch`, `@defer` or `ng-template` body). Otherwise the
   compiler inlines it and never stores it in the LView.
3. The value is an array whose `[1]` is an object.
4. Its `[6]` is an object.

Minimal template:

```html
@let list = items;
@for (item of list; track item.id) {
  {{ list.length }}
}
```

with `items` being an array of at least 7 objects.

If `[6]` is frozen, cleanup throws. If it's mutable, it gets `i18nNodes` and `dehydratedIcuData` added silently.

## Reproduce

```bash
yarn install
yarn ng serve
```

- `http://localhost:4200/frozen`: a frozen array of 7 frozen objects in a `@let`. The console shows
  `TypeError: Cannot add property i18nNodes, object is not extensible` at `cleanupI18nHydrationData`.
- `http://localhost:4200/mutable`: the same with plain objects. Click "Inspect items[6]" and you get
  `["id","i18nNodes","dehydratedIcuData"]`. Angular wrote two properties onto application data.

## Cause

`cleanupDehydratedViews` → `cleanupLView` iterates `lView[HEADER_OFFSET .. tView.bindingStartIndex)` and recurses into
every slot passing `isLView(value)`, which is only `Array.isArray(value) && typeof value[TYPE] === 'object'`.
`ɵɵdeclareLet`/`ɵɵstoreLet` put `@let` values into that same slot range, so an array of objects is mistaken for an
LView, and `cleanupI18nHydrationData` writes `i18nNodes`/`dehydratedIcuData` onto `value[HYDRATION]` (= `value[6]`).

Frozen data is common with NgRx `strictStateImmutability`, where it throws in dev mode. In production the store objects
aren't frozen, so the store state is silently mutated.
