from fastapi import Depends, FastAPI, Query
from typing import Optional, List
from pydantic import BaseModel
import datetime
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def main():
    return {"message": "Hello World"}


# Sample data structure
data = [
    {
        "project": "Project A",
        "type": "current",
        "businessMonth": {
            "2023": {
                "January": 1200,
                "February": 1300,
                # ... other months
            }
        },
        "previousYearTotal": 10000,  # Sum of costs from the previous year
        "fiscalYear": 2023,
        "insertionDate": datetime.date(2023, 1, 1),
        "costType": "Operational",
        "department": "IT"
    },
    {
        "project": "Project B",
        "type": "current",
        "businessMonth": {
            "2023": {
                "March": 1200,
                "April": 1300,
                # ... other months
            }
        },
        "previousYearTotal": 10000,  # Sum of costs from the previous year
        "fiscalYear": 2023,
        "insertionDate": datetime.date(2023, 2, 1),
        "costType": "Operational",
        "department": "IT"
    }
]


class FilterParams(BaseModel):
    type: Optional[str] = None
    fiscalYear: Optional[int] = None
    costType: Optional[str] = None
    department: Optional[str] = None
    insertionMonth: Optional[str] = None


# Function to get filter parameters from query
@app.get("/api/projects")
async def get_projects(filters: FilterParams = Depends()):
    # Use the attributes of the FilterParams model
    filtered_data = [project for project in data if (
            (filters.type is None or project["type"] == filters.type) and
            (filters.fiscalYear is None or project["fiscalYear"] == filters.fiscalYear) and
            (filters.costType is None or project["costType"] == filters.costType) and
            (filters.department is None or project["department"] == filters.department) and
            (filters.insertionMonth is None or project["insertionDate"].strftime("%B") == filters.insertionMonth)
    )]
    return {"projects": filtered_data}


if __name__ == "__main__":
    main()
