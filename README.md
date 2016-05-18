misty-config
=========

`misty-config` is cascading configurations with environment variables
support. The name is a pun, `cascade + environment = mist`.

* Reads a cascading configuration files via the npm
  [`config`](https://github.com/lorenwest/node-config) package

* Resolve occurances of `${ENV}` syntax that appear in the right-hand
  side to the values set in the environent variables.

* The returned configuration object is immediately set to immutable
  without waiting for the first `get` call.

* Provides a `webpack` loader that compiles the configuration into the
  build as a POJO, removing the need for the browser to fetch
  `node-config` and `hjson`.

* Since this module declares a dependency on `hjson`, `hjson` files
  are supported out-of-the-box.
