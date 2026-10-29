from fastapi import APIRouter
from app.schemas.schemas import ChatRequest, ChatResponse
from app.services.chat_service import process_chat_message

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat_with_agronomist(req: ChatRequest):
    """
    Conversational agricultural assistant endpoint.
    Processes queries with configured LLM (Gemini/OpenAI) or local verified botanical knowledge base.
    """
    return await process_chat_message(
        message=req.message,
        language=req.language,
        current_scan_id=req.current_scan_id,
        history=req.history
    )
