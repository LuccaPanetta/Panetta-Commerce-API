from fastapi import Depends, HTTPException, status
from . import models, utils

def get_current_admin_user(current_user: models.User = Depends(utils.get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="No tienes permisos de administrador"
        )
    return current_user