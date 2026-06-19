import pandas as pd
class ChartService:

    @staticmethod
    def suggest_chart(df:pd.DataFrame):

        cols = df.columns.tolist()

        if len(cols) != 2:
            return None

        first = df[cols[0]]
        second = df[cols[1]]

        first_is_num = pd.api.types.is_numeric_dtype(first)
        second_is_num = pd.api.types.is_numeric_dtype(second) #handles both int64 and float64

        if not first_is_num and second_is_num:

            return {
                "chart_type": "bar",
                "x": cols[0],
                "y": cols[1],
                "x_label": cols[0].replace("_", " ").title(),
                "y_label": cols[1].replace("_", " ").title()
            }
        elif first_is_num and not second_is_num:
            return {
                "chart_type": "bar",
                "x": cols[1],
                "y": cols[0],
                "x_label": cols[1].replace("_", " ").title(),
                "y_label": cols[0].replace("_", " ").title()
            }
        
        elif first_is_num and second_is_num:

            return {
                "chart_type": "line",
                "x": cols[0],
                "y": cols[1],
                "x_label": cols[0].replace("_", " ").title(),
                "y_label": cols[1].replace("_", " ").title()
            }
        
        else:
            return None