import os
import shutil

class WorkspaceService:

    BASE_DIR = "user_data"

    @staticmethod
    def get_user_folder(user_id:int):
        path = os.path.join(WorkspaceService.BASE_DIR,str(user_id))
        os.makedirs(path,exist_ok=True)

        return path
    
    @staticmethod
    def get_db_path(user_id:int):
        return os.path.join(WorkspaceService.get_user_folder(user_id),"database.db")
        
    

    @staticmethod
    def get_upload_dir(user_id:int):

        path = os.path.join(
            WorkspaceService.get_user_folder(user_id),
            "uploads"
        )

        os.makedirs(path, exist_ok=True)

        return path
    
    @staticmethod
    def get_schema_path(user_id:int):

        return os.path.join(
            WorkspaceService.get_user_folder(user_id),
            "schema.json"
        )
    
    @staticmethod
    def clear_workspace(user_id: int):

        folder = WorkspaceService.get_user_folder(
            user_id
        )

        if os.path.exists(folder):
            shutil.rmtree(folder)

        os.makedirs(folder, exist_ok=True)
