class SchemaService:

    @staticmethod
    def build_schema(all_tables):

        all_schemas = []

        for table_name, df in all_tables.items():

            column_info = "\n".join(
                df.columns
            )

            table_schema = f"""
Table: {table_name}

Columns:
{column_info}
"""

            all_schemas.append(
                table_schema
            )

        schema = "\n\n".join(
            all_schemas
        )

        return schema
    

    @staticmethod
    def find_relations(all_tables):

        relationships = []
        for table1,df1 in all_tables.items():

            for table2,df2 in all_tables.items():

                if(table1>=table2):
                    continue

                common_cols  = (set(df1.columns) & set(df2.columns))

                for col in common_cols:

                    relationships.append(
                        f"{table1}.{col} ↔ {table2}.{col}"
                    )

        return relationships