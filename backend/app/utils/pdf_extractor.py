"""
Utilitários para extração de texto de PDFs
"""
import io
from typing import Optional

# PDF readers (fallbacks)
try:
    from PyPDF2 import PdfReader
except Exception:
    PdfReader = None

try:
    import fitz  # PyMuPDF
except Exception:
    fitz = None

try:
    import pdfplumber
except Exception:
    pdfplumber = None


def extract_text_from_pdf_bytes(pdf_bytes: bytes) -> str:
    """
    Extrai texto de bytes de PDF usando múltiplas bibliotecas como fallback
    
    Args:
        pdf_bytes: Bytes do arquivo PDF
        
    Returns:
        str: Texto extraído do PDF
    """
    if len(pdf_bytes) == 0:
        return ""
    
    # 1) Tentativa com PyPDF2
    if PdfReader is not None:
        try:
            reader = PdfReader(io.BytesIO(pdf_bytes))
            pages = [(p.extract_text() or "") for p in reader.pages]
            text = "\n".join(pages).strip()
            if text:
                return text
        except Exception:
            pass
    
    # 2) Tentativa com PyMuPDF (fitz)
    if fitz is not None:
        try:
            doc = fitz.open(stream=pdf_bytes, filetype="pdf")
            pages = [page.get_text() or "" for page in doc]
            doc.close()
            text = "\n".join(pages).strip()
            if text:
                return text
        except Exception:
            pass
    
    # 3) Tentativa com pdfplumber
    if pdfplumber is not None:
        try:
            with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
                pages = [p.extract_text() or "" for p in pdf.pages]
            text = "\n".join(pages).strip()
            if text:
                return text
        except Exception:
            pass
    
    return ""


def get_available_pdf_libraries() -> list[str]:
    """
    Retorna lista das bibliotecas PDF disponíveis
    
    Returns:
        list[str]: Lista de bibliotecas disponíveis
    """
    available = []
    if PdfReader is not None:
        available.append("PyPDF2")
    if fitz is not None:
        available.append("PyMuPDF")
    if pdfplumber is not None:
        available.append("pdfplumber")
    return available
