import json
import os

from services.workspace_service import WorkspaceService

class SchemaStorage:

    @staticmethod
    def save_schema(user_id:int,schema:str):

        path = WorkspaceService.get_schema_path(
            user_id
        )

        with open(path,"w",encoding="utf-8") as f:
            json.dump(
                {"schema":schema},
                f
            )

    @staticmethod
    def load_schema(user_id:int):

        path = WorkspaceService.get_schema_path(
            user_id
        )

        if not os.path.exists(path):
            return None

        with open(path,"r",encoding="utf-8") as f:
            data = json.load(f)

        return data["schema"]