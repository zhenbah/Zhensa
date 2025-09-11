# SPDX-License-Identifier: MIT
# pylint: disable=missing-module-docstring,disable=missing-class-docstring,invalid-name

from parameterized import parameterized
from tests import SearxTestCase
import zhensa.exceptions
from zhensa import get_setting


class TestExceptions(SearxTestCase):

    @parameterized.expand(
        [
            zhensa.exceptions.ZhensaEngineAccessDeniedException,
            zhensa.exceptions.ZhensaEngineCaptchaException,
            zhensa.exceptions.ZhensaEngineTooManyRequestsException,
        ]
    )
    def test_default_suspend_time(self, exception):
        with self.assertRaises(exception) as e:
            raise exception()
        self.assertEqual(
            e.exception.suspended_time,
            get_setting(exception.SUSPEND_TIME_SETTING),
        )

    @parameterized.expand(
        [
            zhensa.exceptions.ZhensaEngineAccessDeniedException,
            zhensa.exceptions.ZhensaEngineCaptchaException,
            zhensa.exceptions.ZhensaEngineTooManyRequestsException,
        ]
    )
    def test_custom_suspend_time(self, exception):
        with self.assertRaises(exception) as e:
            raise exception(suspended_time=1337)
        self.assertEqual(e.exception.suspended_time, 1337)
