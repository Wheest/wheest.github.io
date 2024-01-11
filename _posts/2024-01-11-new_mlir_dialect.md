---
layout: post
title:  "Step-by-step Guide to Adding a New Dialect in MLIR"
date:   2024-01-11 12:00:00 +0000
categories: blog
tags: mlir compiler
excerpt_separator: <!--more-->
---

<img src="/assets/pics/2023_mlir_dialect.png" width="1024">

For one of my projects, I needed to add a new dialect to the main MLIR tree.
However, following the information available, I encountered some issues.
I made a "clean" example dialect, which I was able to add correctly.
This post discusses how this is achieved, and links to some code.

<!--more-->

The information in this post was sourced partially from [Chapter 2 of the Toy tutorial](https://mlir.llvm.org/docs/Tutorials/Toy/Ch-2) and [Creating a Dialect tutorial](https://mlir.llvm.org/docs/Tutorials/CreatingADialect/).
I hope to update the latter with some of the steps described below.
Note that MLIR/LLVM often has API breaking changes, and this guide may not by entirely correct or best practice when reading.
My code builds on `42204c9`.

If you just want to see the code/diff for a complete working example, [checkout the `new_dialect` branch on GitHub](https://github.com/Wheest/llvm-project/tree/new_dialect).
Overall, to add the new dialect I changed three files and created six new ones.
If you're unfamiliar with MLIR, I recommend you check out the [docs](https://mlir.llvm.org/), and [the full Toy tutorial](https://mlir.llvm.org/docs/Tutorials/Toy/Ch-1/) is worth doing too.

### `include`

The first thing we need to do is decide how we want to define our dialect.
MLIR allows us to define the dialect using [TableGen](https://llvm.org/docs/TableGen/index.html), which automatically generates a lot of the boilerplate required, as well as reducing the costs of maintenance if an API breaking change occurs.
We could also write the C++ ourselves, but for many dialects this is overkill.

**Step 1**: Let's create a directory `mlir/include/mlir/Dialect/Foo/`, where we will store our dialect definitions.
Make sure to `add_subdirectory(Foo)` in the `CMakeLists.txt` of `mlir/include/mlir/Dialect`.

**Step 2**: Next, we're going to define the basic definition of our dialect, `mlir/include/mlir/Dialect/Foo/FooBase.td`.
Here's we'll give our dialect a name, the C++ namespace that it will use, and a description:

```tablegen
#ifndef FOO_BASE
#define FOO_BASE
include "mlir/IR/OpBase.td"
def Foo_Dialect : Dialect {
  let name = "foo";
  let cppNamespace = "::mlir::foo";
  let description = [{
    Lorem Ipsum
  }];
}
#endif // FOO_BASE
```

**Step 3**: Let's also create a mostly blank file `FooOps.td`.
This is where we would include the definition of the operations of our dialect, if we had any.
For now, let's just put some simple includes:

```tablegen
#ifndef FOO_OPS
#define FOO_OPS

include "mlir/Dialect/Foo/FooBase.td"
include "mlir/Interfaces/InferTypeOpInterface.td"
include "mlir/Interfaces/VectorInterfaces.td"
include "mlir/Interfaces/SideEffectInterfaces.td"

#endif // FOO_OPS
```

These two files will generate some C++ files that can be included elsewhere in the project.
For example, in our build directory (once we've set up the rest of our code), we will generate the file `./tools/mlir/include/mlir/Dialect/Foo/FooOps.h.inc`.
This will look something like this, actually defining the C++ class of our dialect.

```cpp
/*===- TableGen'erated file -------------------------------------*- C++ -*-===*\
|*                                                                            *|
|* Dialect Declarations                                                       *|
|*                                                                            *|
|* Automatically generated file, do not edit!                                 *|
|* From: FooOps.td                                                            *|
|*                                                                            *|
\*===----------------------------------------------------------------------===*/

namespace mlir {
namespace foo {

class FooDialect : public ::mlir::Dialect {
  explicit FooDialect(::mlir::MLIRContext *context);

  void initialize();
  friend class ::mlir::MLIRContext;
public:
  ~FooDialect() override;
  static constexpr ::llvm::StringLiteral getDialectNamespace() {
    return ::llvm::StringLiteral("foo");
  }
};
} // namespace foo
} // namespace mlir
MLIR_DECLARE_EXPLICIT_TYPE_ID(::mlir::foo::FooDialect)
```

Note that the above is _automatically_ generated, and you should only edit the TableGen files to create it.
You can extend the dialect with C++ later if you want, or for some advanced cases you may need to define your dialect in C++ from the start.

**Step 4**: I also defined a file `Foo.h`, which we can use to include our dialect elsewhere, avoiding the ugliness of `.inc` files.
This looks like:

```cpp
#ifndef MLIR_DIALECT_FOO_H_
#define MLIR_DIALECT_FOO_H_

#include "mlir/Bytecode/BytecodeOpInterface.h"
#include "mlir/IR/BuiltinTypes.h"
#include "mlir/IR/Dialect.h"
#include "mlir/IR/OpDefinition.h"
#include "mlir/IR/OpImplementation.h"
#include "mlir/Interfaces/InferTypeOpInterface.h"
#include "mlir/Interfaces/SideEffectInterfaces.h"
#include "mlir/Interfaces/VectorInterfaces.h"

//===----------------------------------------------------------------------===//
// Foo Dialect
//===----------------------------------------------------------------------===//

#include "mlir/Dialect/Foo/FooOpsDialect.h.inc"

//===----------------------------------------------------------------------===//
// Foo Dialect Operations
//===----------------------------------------------------------------------===//

#define GET_OP_CLASSES
#include "mlir/Dialect/Foo/FooOps.h.inc"

#endif // MLIR_DIALECT_FOO_H_
```

**Step 5**: Finally, let's create the `CMakeLists.txt` file in the `Foo` include directory:

```cmake
add_mlir_dialect(FooOps foo)
add_mlir_doc(FooOps FooOps Dialects/ -gen-dialect-doc -dialect foo)
```

This ensures our TableGen is executed properly.

**Step 6**: Finally, an optional step is to ensure that our dialect is registered globally, otherwise we will need to add it to the registry of whatever tool we need it for manually.
If you open the file `mlir/include/mlir/InitAllDialects.h`, you will see where this is done.
Add the lines `#include "mlir/Dialect/Foo/Foo.h"`, and `foo::FooDialect,` to the `registry.insert` call, and once we're finished the dialect should be globally available.
You can put a `registry.insert` line for your dialect in the executable you care about if you don't want it registered globally.

### Source code

There isn't much regarding "implementation" for our dialect, since we don't actually have any operations or transformations yet.
However to get our minimum working dialect, we do require a little bit of code.

**Step 7**: First, let's create a `Foo` directory in `mlir/lib/Dialect/Foo/`.
Be sure to add `add_subdirectory(Foo)` to the `CMakeLists.txt` of the parent directory.
Next, let's create a file `FooDialect.cpp`.
This will use some of auto-generated implementation boilerplate from the previous steps, see the `#include` statements.


```cpp
#include "mlir/Dialect/Foo/Foo.h"

using namespace mlir;
using namespace mlir::foo;

#include "mlir/Dialect/Foo/FooOpsDialect.cpp.inc"

void mlir::foo::FooDialect::initialize() {
  addOperations<
#define GET_OP_LIST
#include "mlir/Dialect/Foo/FooOps.cpp.inc"
      >();
}
```

**Step 8**: Finally, let's create our `CMakeLists.txt`.
This will create the dialect library, and allow us to link against other executables.
It should also make the library available under the CMake variable `dialect_libs`, which is used in the compilation of tools such as `mlir-opt`.
Thus you won't need to do any manual linking to get that working.

```cmake
add_mlir_dialect_library(MLIRFooDialect
  FooDialect.cpp

  ADDITIONAL_HEADER_DIRS
  ${MLIR_MAIN_INCLUDE_DIR}/mlir/Dialect/Foo

  DEPENDS
  MLIRFooOpsIncGen

  LINK_LIBS PUBLIC
  MLIRDialect
  MLIRIR
  MLIRUBDialect
)
```

### Verification

Great, we now have everything we need to compile, creating our new dialect `Foo`, and registering it in the main MLIR dialect registry.
Go ahead and build.

Now, to verify that our dialect was added correctly, we can run `mlir-opt`.
Pass the `--show-dialects` and it will give a list of loaded dialects.
You should see `foo` amongst them.

And that's us done.
You can extend this example to make a more fully featured dialect.
