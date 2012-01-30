continuous deployment cluster
=============================

This is an example project demonstrating how to set up continuous multi-server
cluster deployment with propagit and seaport.

example
=======

Suppose there are 3 systems: hub, say, and web.

on hub:

    $ npm install -g seaport propagit
    $ seaport 6000 &
    $ propagit hub --port=6001 --secret=beepboop &
 
on say:

    $ propagit drone --hub=hubhost:6001 --secret=beepboop -- node say.js

on web:

    $ propagit drone --hub=hubhost:6001 --secret beepboop -- node web.js

then from your git project (with `node_modules` checked in):

    $ git push http://hubhost:6002/webapp master
    $ git log|head -n1
    commit 74336bc1db98478e02e69f59e7100895be207389
    $ propagit deploy --hub=hubhost=6001 --secret=beepboop \
      webapp 74336bc1db98478e02e69f59e7100895be207389
    ^C

now dump the port tables:

    $ seaport localhost:6000 show
    {
      "74336bc1db98478e02e69f59e7100895be207389": {
        "http": [
          {
            "host": "127.0.0.1",
            "port": 15194
          }
        ],
        "say": [
          {
            "host": "127.0.0.1",
            "port": 13308
          }
        ]
      }
    }

and curl the http server:

    $ curl localhost:15194
    beep boop
    $ curl localhost:15194/HUG
    HUG ALL HUMANS

Hooray everything works!

Now make a change to the git repo and redeploy the latest hash:

    $ git commit -am'newlines, beepity'
    $ git push http://localhost:6002/webapp master
    $ git log|head -n1
    commit 40548daf17f7d25ec0f1925b97d24bc05043e4ed
    $ propagit deploy --hub=localhost:6001 --secret=beepboop \
      webapp 40548daf17f7d25ec0f1925b97d24bc05043e4ed
    ^C

and dump the new port table:

    $ seaport localhost:6000 show
    {
      "74336bc1db98478e02e69f59e7100895be207389": {
        "http": [
          {
            "host": "127.0.0.1",
            "port": 15194
          }
        ],
        "say": [
          {
            "host": "127.0.0.1",
            "port": 13308
          }
        ]
      },
      "40548daf17f7d25ec0f1925b97d24bc05043e4ed": {
        "http": [
          {
            "host": "127.0.0.1",
            "port": 10745
          }
        ],
        "say": [
          {
            "host": "127.0.0.1",
            "port": 10831
          }
        ]
      }
    }

and curl against the new entry:

    $ curl localhost:10745
    beepity boop!
    $ curl localhost:10745/BEFRIEND
    BEFRIEND ALL HUMANS

Hooray we pushed out a new version of the cluster alongside the old one!

Now just glue seaport's port tables programatically to an HTTP proxy like
[bouncy](https://github.com/substack/bouncy).

You can set up A/B testing or iterative deployment at the proxy level with this
clustering approach!

Soon propagit will support taking down deployments that aren't in use anymore.
