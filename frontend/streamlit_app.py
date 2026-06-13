import streamlit as st

st.set_page_config(
    page_title="Universal Data Agent",
    page_icon="📊"
)

st.title("📊 Universal Data Agent")

st.write(
    "Upload CSV files and query them using natural language."
)

uploaded_files = st.file_uploader(
    "Upload CSV Files",
    type=["csv"],
    accept_multiple_files=True
)

import requests

API_URL = "http://127.0.0.1:8000"

if st.button("Upload Files"):

    for file in uploaded_files:

        response = requests.post(
            f"{API_URL}/upload",
            files={
                "file": (
                    file.name,
                    file,
                    "text/csv"
                )
            }
        )

        st.success(
            f"{file.name} uploaded"
        )

response = requests.get(f"{API_URL}/tables")
tables = response.json()["tables"]

for table in tables:
    preview = requests.get(f"{API_URL}/preview/{table}")
    st.subheader(table)
    st.dataframe(preview.json()["data"])

if st.button("Build Schema"):

    response = requests.post("http://127.0.0.1:8000/build-schema")

    result = response.json()

    st.write(result)

question = st.text_input("Tell us what you want to know ?")

if st.button("Ask"):
    with st.spinner("Thinking..."):
        response = requests.post(
        "http://127.0.0.1:8000/query",
        json={
            "question": question
        }
        )

        result_final = response.json()

st.subheader("Generated SQL")

st.write(result_final)
st.code(
    result_final["sql"],
    language="sql"
)


st.subheader("Answer")

st.success(
    result_final["answer"]
)