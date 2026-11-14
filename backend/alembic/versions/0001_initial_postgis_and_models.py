"""Initial PostGIS extension and core models migration.

Revision ID: 0001
Revises: None
Create Date: 2026-11-14 15:56:00.000000
"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Enable PostGIS extension (conditional on postgres dialect)
    conn = op.get_bind()
    if conn.dialect.name == "postgresql":
        op.execute("CREATE EXTENSION IF NOT EXISTS postgis")

    # 2. Create planets table
    op.create_table(
        "planets",
        sa.Column("id", sa.String(length=32), nullable=False),
        sa.Column("name", sa.String(length=64), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("radius_km", sa.Float(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )

    # 3. Create datasets table
    op.create_table(
        "datasets",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("planet_id", sa.String(length=32), nullable=False),
        sa.Column("category", sa.String(length=64), nullable=False),
        sa.Column("variable", sa.String(length=64), nullable=False),
        sa.Column("source_agency", sa.String(length=128), nullable=True),
        sa.Column("mission", sa.String(length=128), nullable=True),
        sa.Column("instrument", sa.String(length=128), nullable=True),
        sa.Column("format", sa.String(length=64), nullable=True),
        sa.Column("unit", sa.String(length=64), nullable=True),
        sa.Column("native_resolution", sa.String(length=64), nullable=True),
        sa.Column("temporal_start", sa.DateTime(timezone=True), nullable=True),
        sa.Column("temporal_end", sa.DateTime(timezone=True), nullable=True),
        sa.Column("coordinate_reference_system", sa.String(length=128), nullable=False),
        sa.Column("processing_level", sa.String(length=64), nullable=True),
        sa.Column("license", sa.String(length=255), nullable=True),
        sa.Column("source_url", sa.Text(), nullable=True),
        sa.Column("citation", sa.Text(), nullable=True),
        sa.Column("local_path", sa.String(length=512), nullable=True),
        sa.Column("checksum", sa.String(length=128), nullable=True),
        sa.Column("ingestion_status", sa.String(length=32), nullable=False),
        sa.Column("quality_notes", sa.Text(), nullable=True),
        sa.Column("is_demo", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["planet_id"], ["planets.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_datasets_planet_id", "datasets", ["planet_id"], unique=False)
    op.create_index("ix_datasets_category", "datasets", ["category"], unique=False)
    op.create_index("ix_datasets_variable", "datasets", ["variable"], unique=False)
    op.create_index("ix_datasets_ingestion_status", "datasets", ["ingestion_status"], unique=False)
    op.create_index("ix_datasets_is_demo", "datasets", ["is_demo"], unique=False)

    # 4. Create layers table
    op.create_table(
        "layers",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("planet_id", sa.String(length=32), nullable=False),
        sa.Column("category", sa.String(length=64), nullable=False),
        sa.Column("dataset_id", sa.String(length=36), nullable=True),
        sa.Column("variable", sa.String(length=64), nullable=False),
        sa.Column("unit", sa.String(length=64), nullable=True),
        sa.Column("available", sa.Boolean(), nullable=False),
        sa.Column("rendering_type", sa.String(length=32), nullable=False),
        sa.Column("rendering_url", sa.Text(), nullable=True),
        sa.Column("coordinate_reference_system", sa.String(length=128), nullable=False),
        sa.Column("style", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["dataset_id"], ["datasets.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["planet_id"], ["planets.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_layers_planet_id", "layers", ["planet_id"], unique=False)
    op.create_index("ix_layers_category", "layers", ["category"], unique=False)
    op.create_index("ix_layers_dataset_id", "layers", ["dataset_id"], unique=False)
    op.create_index("ix_layers_variable", "layers", ["variable"], unique=False)
    op.create_index("ix_layers_available", "layers", ["available"], unique=False)

    # 5. Create regions table
    op.create_table(
        "regions",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("planet_id", sa.String(length=32), nullable=False),
        sa.Column("footprint", sa.JSON(), nullable=True),
        sa.Column("coordinate_reference_system", sa.String(length=128), nullable=False),
        sa.Column("source_provenance", sa.Text(), nullable=True),
        sa.Column("tags", sa.JSON(), nullable=True),
        sa.Column("characteristics", sa.JSON(), nullable=True),
        sa.Column("is_demo", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["planet_id"], ["planets.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_regions_planet_id", "regions", ["planet_id"], unique=False)
    op.create_index("ix_regions_is_demo", "regions", ["is_demo"], unique=False)

    # 6. Create analysis_runs table
    op.create_table(
        "analysis_runs",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("analysis_type", sa.String(length=64), nullable=False),
        sa.Column("status", sa.String(length=32), nullable=False),
        sa.Column("parameters", sa.JSON(), nullable=False),
        sa.Column("results", sa.JSON(), nullable=True),
        sa.Column("error_message", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_analysis_runs_analysis_type", "analysis_runs", ["analysis_type"], unique=False)
    op.create_index("ix_analysis_runs_status", "analysis_runs", ["status"], unique=False)


def downgrade() -> None:
    op.drop_table("analysis_runs")
    op.drop_table("regions")
    op.drop_table("layers")
    op.drop_table("datasets")
    op.drop_table("planets")
