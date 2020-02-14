# Newman Directory Runner (newman-dr)

This is a javascript tool that wraps the newman postman client and runs all collections in a directory.

## Installation

1. Clone this Repo
2. `npm install`
3. `npm link` (creates a symlink to the utility on your system)
4. Alternatively - `npm run newman-dr <args>`

## Usage

```bash
newman-dr 
    -c/--collections <collections directory> 
    -e/--environment <environment file>
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[The Unlicense](https://choosealicense.com/licenses/unlicense/)