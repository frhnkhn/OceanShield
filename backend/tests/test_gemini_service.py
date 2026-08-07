import unittest
from unittest.mock import patch

from app.models.report import Report
from app.services import gemini_service


class GeminiServiceTests(unittest.TestCase):
    def test_prompt_includes_report_and_detection_context(self):
        report = Report(
            title="High waves near shore",
            description="Large waves observed close to the promenade.",
            hazard="High Waves",
            severity=4,
            latitude=13.0827,
            longitude=80.2707,
        )
        report.ai_results = {"detections": [{"label": "boat", "confidence": 0.91}]}

        prompt = gemini_service.build_incident_prompt(report)

        self.assertIn("High waves near shore", prompt)
        self.assertIn("boat (91%)", prompt)
        self.assertIn("Do not claim", prompt)

    def test_request_summary_requires_server_key(self):
        with patch.object(gemini_service, "GEMINI_API_KEY", None):
            with self.assertRaisesRegex(RuntimeError, "GEMINI_API_KEY"):
                gemini_service.request_summary("test")


if __name__ == "__main__":
    unittest.main()
