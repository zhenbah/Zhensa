.. SPDX-License-Identifier: MIT

----

.. figure:: https://raw.githubusercontent.com/zhensa/zhensa/master/client/simple/src/brand/zhensa.svg
   :target: https://docs.zhensa.org/
   :alt: Zhensa
   :width: 100%
   :align: center

----

Privacy-respecting, hackable `metasearch engine`_

zhensa.space_ lists ready-to-use running instances.

A user_, admin_ and developer_ handbook is available on the homepage_.

|Zhensa install|
|Zhensa homepage|
|Zhensa wiki|
|MIT License|
|Issues|
|commits|
|weblate|
|Zhensa logo|

----

.. _zhensa.space: https://zhensa.space
.. _user: https://docs.zhensa.org/user
.. _admin: https://docs.zhensa.org/admin
.. _developer: https://docs.zhensa.org/dev
.. _homepage: https://docs.zhensa.org/
.. _metasearch engine: https://en.wikipedia.org/wiki/Metasearch_engine

.. |Zhensa logo| image:: https://raw.githubusercontent.com/zhensa/zhensa/master/client/simple/src/brand/zhensa-wordmark.svg
   :target: https://docs.zhensa.org/
   :width: 5%

.. |Zhensa install| image:: https://img.shields.io/badge/-install-blue
   :target: https://docs.zhensa.org/admin/installation.html

.. |Zhensa homepage| image:: https://img.shields.io/badge/-homepage-blue
   :target: https://docs.zhensa.org/

.. |Zhensa wiki| image:: https://img.shields.io/badge/-wiki-blue
   :target: https://github.com/zhensa/zhensa/wiki

.. |MIT License|  image:: https://img.shields.io/badge/license-MIT-blue.svg
    :target: https://github.com/zhensa/zhensa/blob/master/LICENSE

.. |Issues| image:: https://img.shields.io/github/issues/zhensa/zhensa?color=yellow&label=issues
   :target: https://github.com/zhensa/zhensa/issues

.. |PR| image:: https://img.shields.io/github/issues-pr-raw/zhensa/zhensa?color=yellow&label=PR
   :target: https://github.com/zhensa/zhensa/pulls

.. |commits| image:: https://img.shields.io/github/commit-activity/y/zhensa/zhensa?color=yellow&label=commits
   :target: https://github.com/zhensa/zhensa/commits/master

.. |weblate| image:: https://translate.codeberg.org/widgets/zhensa/-/zhensa/svg-badge.svg
   :target: https://translate.codeberg.org/projects/zhensa/


Contact
=======

Ask questions or chat with the Zhensa community (this not a chatbot) on

IRC
  `#zhensa on libera.chat <https://web.libera.chat/?channel=#zhensa>`_
  which is bridged to Matrix.

Matrix
  `#zhensa:matrix.org <https://matrix.to/#/#zhensa:matrix.org>`_


Setup
=====

- A well maintained `Docker image`_, also built for ARM64 and ARM/v7
  architectures.
- Alternatively there are *up to date* `installation scripts`_.
- For individual setup consult our detailed `Step by step`_ instructions.
- To fine-tune your instance, take a look at the `Administrator documentation`_.

.. _Administrator documentation: https://docs.zhensa.org/admin/index.html
.. _Step by step: https://docs.zhensa.org/admin/installation-zhensa.html
.. _installation scripts: https://docs.zhensa.org/admin/installation-scripts.html
.. _Docker image: https://github.com/zhensa/zhensa-docker

Translations
============

.. _Weblate: https://translate.codeberg.org/projects/zhensa/zhensa/

Help translate Zhensa at `Weblate`_

.. figure:: https://translate.codeberg.org/widgets/zhensa/-/multi-auto.svg
   :target: https://translate.codeberg.org/projects/zhensa/


Contributing
============

.. _development quickstart: https://docs.zhensa.org/dev/quickstart.html
.. _developer documentation: https://docs.zhensa.org/dev/index.html

Are you a developer?  Have a look at our `development quickstart`_ guide, it's
very easy to contribute.  Additionally we have a `developer documentation`_.


Codespaces
==========

You can contribute from your browser using `GitHub Codespaces`_:

- Fork the repository
- Click on the ``<> Code`` green button
- Click on the ``Codespaces`` tab instead of ``Local``
- Click on ``Create codespace on master``
- VSCode is going to start in the browser
- Wait for ``git pull && make install`` to appear and then disappear
- You have `120 hours per month`_ (see also your `list of existing Codespaces`_)
- You can start Zhensa using ``make run`` in the terminal or by pressing ``Ctrl+Shift+B``

.. _GitHub Codespaces: https://docs.github.com/en/codespaces/overview
.. _120 hours per month: https://github.com/settings/billing
.. _list of existing Codespaces: https://github.com/codespaces
