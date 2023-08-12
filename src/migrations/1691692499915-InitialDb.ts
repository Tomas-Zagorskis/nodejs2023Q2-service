import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialDb1691692499915 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "public"."album" (
        "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
        "name" character varying NOT NULL,
        "year" integer NOT NULL,
        "artistId" uuid,
        CONSTRAINT "PK_58e0b4b8a31bb897e6959fe3206" PRIMARY KEY ("id")
      ) WITH (oids = false);
    `);

    await queryRunner.query(`
      CREATE TABLE "public"."artist" (
        "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
        "name" character varying NOT NULL,
        "grammy" boolean DEFAULT false NOT NULL,
        CONSTRAINT "PK_55b76e71568b5db4d01d3e394ed" PRIMARY KEY ("id")
      ) WITH (oids = false);
    `);

    await queryRunner.query(`
      CREATE TABLE "public"."favorites" (
        "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
        CONSTRAINT "PK_890818d27523748dd36a4d1bdc8" PRIMARY KEY ("id")
      ) WITH (oids = false);
    `);

    await queryRunner.query(`
      CREATE TABLE "public"."favorites_albums_album" (
        "albumId" uuid NOT NULL,
        "favoritesId" uuid NOT NULL,
        CONSTRAINT "PK_4caba2d65763821c7dd2db51558" PRIMARY KEY ("albumId", "favoritesId")
      ) WITH (oids = false);
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_31b327b5a4f89d2eb722968982" ON "public"."favorites_albums_album" USING btree ("favoritesId");
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_4ff0c3cde93d2bc8c23c2b72c3" ON "public"."favorites_albums_album" USING btree ("albumId");
    `);

    await queryRunner.query(`
      CREATE TABLE "public"."favorites_artists_artist" (
        "artistId" uuid NOT NULL,
        "favoritesId" uuid NOT NULL,
        CONSTRAINT "PK_a6aeacbfda85e00ccc625a84474" PRIMARY KEY ("artistId", "favoritesId")
      ) WITH (oids = false);
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_2a44f2a39bd14c72dfd8ad7933" ON "public"."favorites_artists_artist" USING btree ("artistId");
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_663b6278dbd0f67925d1238ade" ON "public"."favorites_artists_artist" USING btree ("favoritesId");
    `);

    await queryRunner.query(`
      CREATE TABLE "public"."favorites_tracks_track" (
        "trackId" uuid NOT NULL,
        "favoritesId" uuid NOT NULL,
        CONSTRAINT "PK_613647698cfa077425b1047e1a6" PRIMARY KEY ("trackId", "favoritesId")
      ) WITH (oids = false);
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_3ecf4f6fab33cc9611b9e40292" ON "public"."favorites_tracks_track" USING btree ("favoritesId");
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_fee451584feed445b14adb7fb8" ON "public"."favorites_tracks_track" USING btree ("trackId");
    `);

    await queryRunner.query(`
      CREATE TABLE "public"."track" (
        "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
        "name" character varying NOT NULL,
        "duration" integer NOT NULL,
        "albumId" uuid,
        "artistId" uuid,
        CONSTRAINT "PK_0631b9bcf521f8fab3a15f2c37e" PRIMARY KEY ("id")
      ) WITH (oids = false);
    `);

    await queryRunner.query(`
      CREATE TABLE "public"."user" (
        "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
        "login" character varying NOT NULL,
        "password" character varying NOT NULL,
        "version" integer DEFAULT '1' NOT NULL,
        "createdAt" bigint NOT NULL,
        "updatedAt" bigint NOT NULL,
        CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
      ) WITH (oids = false);
    `);

    await queryRunner.query(`
      ALTER TABLE ONLY "public"."album" ADD CONSTRAINT "FK_3d06f25148a4a880b429e3bc839" FOREIGN KEY ("artistId") REFERENCES artist(id) ON DELETE SET NULL NOT DEFERRABLE;
    `);

    await queryRunner.query(`
      ALTER TABLE ONLY "public"."favorites_albums_album" ADD CONSTRAINT "FK_31b327b5a4f89d2eb7229689829" FOREIGN KEY ("favoritesId") REFERENCES favorites(id) ON UPDATE CASCADE ON DELETE SET NULL NOT DEFERRABLE;
    `);

    await queryRunner.query(`
      ALTER TABLE ONLY "public"."favorites_albums_album" ADD CONSTRAINT "FK_4ff0c3cde93d2bc8c23c2b72c3f" FOREIGN KEY ("albumId") REFERENCES album(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;
    `);

    await queryRunner.query(`
      ALTER TABLE ONLY "public"."favorites_artists_artist" ADD CONSTRAINT "FK_2a44f2a39bd14c72dfd8ad7933b" FOREIGN KEY ("artistId") REFERENCES artist(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;
    `);

    await queryRunner.query(`
      ALTER TABLE ONLY "public"."favorites_artists_artist" ADD CONSTRAINT "FK_663b6278dbd0f67925d1238ade2" FOREIGN KEY ("favoritesId") REFERENCES favorites(id) ON UPDATE CASCADE ON DELETE SET NULL NOT DEFERRABLE;
    `);

    await queryRunner.query(`
      ALTER TABLE ONLY "public"."favorites_tracks_track" ADD CONSTRAINT "FK_3ecf4f6fab33cc9611b9e402927" FOREIGN KEY ("favoritesId") REFERENCES favorites(id) ON UPDATE CASCADE ON DELETE SET NULL NOT DEFERRABLE;
    `);

    await queryRunner.query(`
      ALTER TABLE ONLY "public"."favorites_tracks_track" ADD CONSTRAINT "FK_fee451584feed445b14adb7fb80" FOREIGN KEY ("trackId") REFERENCES track(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;
    `);

    await queryRunner.query(`
      ALTER TABLE ONLY "public"."track" ADD CONSTRAINT "FK_997cfd9e91fd00a363500f72dc2" FOREIGN KEY ("artistId") REFERENCES artist(id) ON DELETE SET NULL NOT DEFERRABLE;
    `);

    await queryRunner.query(`
      ALTER TABLE ONLY "public"."track" ADD CONSTRAINT "FK_b105d945c4c185395daca91606a" FOREIGN KEY ("albumId") REFERENCES album(id) ON DELETE SET NULL NOT DEFERRABLE;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE IF EXISTS "favorites_albums_album";
    `);

    await queryRunner.query(`
        DROP TABLE IF EXISTS "favorites_artists_artist";
    `);

    await queryRunner.query(`
        DROP TABLE IF EXISTS "favorites_tracks_track";
    `);

    await queryRunner.query(`
        DROP TABLE IF EXISTS "favorites";
    `);

    await queryRunner.query(`
        DROP TABLE IF EXISTS "track";
    `);

    await queryRunner.query(`
        DROP TABLE IF EXISTS "album";
    `);

    await queryRunner.query(`
        DROP TABLE IF EXISTS "artist";
    `);

    await queryRunner.query(`
        DROP TABLE IF EXISTS "user";
    `);
  }
}
