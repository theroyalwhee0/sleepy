# Changelog

## [Unreleased]
- Nothing


## [0.0.5] - 2022-11-03
### Added
- Add validateNow option to compile and parse.
- Add support for `[ '@set', name, value ]` to set state values.
### Changed
- Refactored parse, compile, exec and serialize around async iterators so that scripts are streamed.
- Fixed bug with UserCommand arguments not matching JSON types.
- Change line numbers to start at 1.
- Fix license in package.json to match LICENSE file.
- Improve error handling.
- Improved testing.

## [0.0.4] - 2022-10-31
### Changed
- Improve ErrorCommand details.
- Add execIterable.

## [0.0.3] - 2022-10-28
### Changed
- Change compileIterable & parseIterable to support AsyncIterable<string>.
- Improve changelog.
### Removed
- Remove unneeded devDependencies.

## [0.0.2] - 2022-10-28
### Added
- Add missing license file.
### Changed
- Cleanup readme.

## [0.0.1] - 2022-10-27
### Added
- Parse from string or Iterable<string>.
- Compile from string or Iterable<string>.
- Serialize compiled code to string.
- Initial release.
