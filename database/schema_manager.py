import os

class SchemaManager:
    @staticmethod
    def get_table_name(file_path):
        return os.path.splitext(os.path.basename(file_path))[0].lower()