import pandas as pd

class Profiler:

    @staticmethod
    def profile(df):
        profile = {
            "rows":len(df),
            "columns":len(df.columns),
            "column_names": list(df.columns),
            "dtypes": df.dtypes.astype(str).to_dict()
        }

        return profile