# Toolkit

## How to install

With nodejs we can't directly install dependencies of git subprojects.
In order to do it, we can use git submodules to make a local reference of the project and them point to the desired folder.
Example:

```shell
git submodule add https://github.com/PetClinica/toolkit.git ./packages/toolkit
git submodule update --init --recursive
```

If you wish, you can cd into packages/toolkit and point to the branch or commit that you want.

Now, just add a dependency on package.json for the module that you wish like this:

```json
...
  "dependencies": {
    "logger": "file:./packages/toolkit/logger"
  }
...
```

## Discord

[Details here](./discord/README.MD)

## Trace

[Details here](./trace/README.MD)

## Logger

[Details here](./logger/README.MD)

## How to remove git submodules

```shell
SUBMODULE_PATH="packages/toolkit"

# 1. Remove the submodule from the .gitmodules file
git submodule deinit -f $SUBMODULE_PATH
git rm -f $SUBMODULE_PATH

# 2. Remove the submodule directory from the working directory
rm -rf .git/modules/$SUBMODULE_PATH

# 3. Remove the submodule reference from the Git index
git commit -m "Remove submodule $SUBMODULE_PATH"

# 4. Remove the actual submodule directory (for local cleanup)
rm -rf $SUBMODULE_PATH

# 5. (Optional) If you want to delete any residual Git submodule data
git gc --prune=now

echo "Submodule $SUBMODULE_PATH removed successfully."
```
