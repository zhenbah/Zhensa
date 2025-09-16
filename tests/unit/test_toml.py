# SPDX-License-Identifier: MIT
# pylint: disable=missing-module-docstring,disable=missing-class-docstring,invalid-name

from tests import zhensaTestCase
from zhensa import compat
from zhensa.favicons.config import DEFAULT_CFG_TOML_PATH


class CompatTest(zhensaTestCase):

    def test_toml(self):
        with DEFAULT_CFG_TOML_PATH.open("rb") as f:
            _ = compat.tomllib.load(f)
