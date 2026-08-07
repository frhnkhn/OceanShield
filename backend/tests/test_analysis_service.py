import unittest
from unittest.mock import patch

from app.services import analysis_service


class AnalysisServiceTests(unittest.TestCase):
    def test_save_path_is_exposed_from_static_mount(self):
        class FakeImage:
            def save(self, path, image_format, quality):
                self.path = path
                self.image_format = image_format
                self.quality = quality

        image = FakeImage()
        with patch.object(analysis_service, "STATIC_DIR") as directory:
            directory.mkdir.return_value = None
            path = analysis_service.save_annotated_image(image, 42)

        self.assertTrue(path.startswith("/static/analysis/report-42-"))
        self.assertEqual(image.image_format, "JPEG")
        self.assertEqual(image.quality, 88)

    def test_detector_is_created_only_once(self):
        detector = object()
        with patch.object(analysis_service, "_model", None), patch.object(
            analysis_service, "UltralyticsDetector", return_value=detector
        ) as constructor:
            self.assertIs(analysis_service.get_detector(), detector)
            self.assertIs(analysis_service.get_detector(), detector)

        constructor.assert_called_once_with(analysis_service.MODEL_PATH)


if __name__ == "__main__":
    unittest.main()
