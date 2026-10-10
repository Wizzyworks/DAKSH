import io
import re
from pypdf import PdfReader
from docx import Document


class CVParserService:
    """
    Service responsible for extracting clean textual content from PDF, DOCX, and TXT files.
    """

    @staticmethod
    def extract_text_from_file(file_obj) -> str:
        """
        Extracts raw text from an uploaded file or file-like object.
        Supports: .pdf, .docx, .txt
        """
        file_name = getattr(file_obj, 'name', '').lower()

        # Read binary content into in-memory buffer
        if hasattr(file_obj, 'read'):
            content_bytes = file_obj.read()
            # Reset file pointer if needed later
            if hasattr(file_obj, 'seek'):
                file_obj.seek(0)
        else:
            content_bytes = file_obj

        buffer = io.BytesIO(content_bytes)

        if file_name.endswith('.pdf'):
            return CVParserService._extract_from_pdf(buffer)
        elif file_name.endswith('.docx'):
            return CVParserService._extract_from_docx(buffer)
        else:
            # Default fallback: plain text UTF-8 / Latin-1
            try:
                return content_bytes.decode('utf-8')
            except UnicodeDecodeError:
                return content_bytes.decode('latin-1', errors='ignore')

    @staticmethod
    def _extract_from_pdf(buffer: io.BytesIO) -> str:
        text_parts = []
        try:
            reader = PdfReader(buffer)
            for page_num, page in enumerate(reader.pages):
                page_text = page.extract_text()
                if page_text:
                    text_parts.append(page_text)
        except Exception as e:
            return f"Error extracting PDF: {str(e)}"

        raw_text = "\n".join(text_parts)
        return CVParserService._clean_extracted_text(raw_text)

    @staticmethod
    def _extract_from_docx(buffer: io.BytesIO) -> str:
        text_parts = []
        try:
            doc = Document(buffer)
            for paragraph in doc.paragraphs:
                if paragraph.text.strip():
                    text_parts.append(paragraph.text)
            for table in doc.tables:
                for row in table.rows:
                    row_text = [cell.text.strip() for cell in row.cells if cell.text.strip()]
                    if row_text:
                        text_parts.append(" | ".join(row_text))
        except Exception as e:
            return f"Error extracting DOCX: {str(e)}"

        raw_text = "\n".join(text_parts)
        return CVParserService._clean_extracted_text(raw_text)

    @staticmethod
    def _clean_extracted_text(text: str) -> str:
        """
        Cleans up excessive spaces, bullet points, and non-printable control characters.
        """
        if not text:
            return ""

        # Replace non-standard bullets with hyphens
        text = re.sub(r'[\u2022\u2023\u25E6\u2043\u2219]', '-', text)
        # Collapse multi-newlines into clean double linebreaks
        text = re.sub(r'\n\s*\n', '\n\n', text)
        # Collapse multiple spaces into single space
        text = re.sub(r'[ \t]+', ' ', text)
        return text.strip()
