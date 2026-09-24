# Release notes

Add a changeset to a pull request that changes the distributed package, including packaged consumer documentation:

```sh
pnpm changeset
```

Choose `patch` for compatible fixes or packaged-documentation corrections and `minor` for new capabilities or clearly announced incompatible changes while the package is in `0.x`. Do not select `major` or publish `1.0.0` without an explicit decision. Internal-only work needs no changeset.

The release workflow collects changesets into a version pull request. Merging that pull request publishes the new version; see [the release procedure](../docs/releasing.md).
