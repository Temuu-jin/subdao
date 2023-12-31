import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    INSERT INTO
      users (
        username,
        password_hash,
        email
      )
    VALUES
      (
        'PixelRanger',
        'hash_pr123',
        'pixelranger@example.com'
      ),
      (
        'TechieWizard',
        'hash_tw456',
        'techiewizard@example.com'
      ),
      (
        'MysteryGamer',
        'hash_mg789',
        'mysterygamer@example.com'
      ),
      (
        'QuantumLeap',
        'hash_ql012',
        'quantumleap@example.com'
      ),
      (
        'AstroNomad',
        'hash_an345',
        'astronomad@example.com'
      ),
      (
        'CosmicCoder',
        'hash_cc678',
        'cosmiccoder@example.com'
      ),
      (
        'PhotonSeeker',
        'hash_ps901',
        'photonseeker@example.com'
      ),
      (
        'NebulaNavigator',
        'hash_nn234',
        'nebulanavigator@example.com'
      ),
      (
        'CyberSage',
        'hash_cs567',
        'cybersage@example.com'
      ),
      (
        'GalaxyVoyager',
        'hash_gv890',
        'galaxyvoyager@example.com'
      ),
      (
        'NovaChaser',
        'hash_nc123',
        'novachaser@example.com'
      ),
      (
        'QuantumMechanic',
        'hash_qm456',
        'quantummechanic@example.com'
      ),
      (
        'StarSurfer',
        'hash_ss789',
        'starsurfer@example.com'
      ),
      (
        'VirtualVirtuoso',
        'hash_vv012',
        'virtualvirtuoso@example.com'
      ),
      (
        'DigitalDrifter',
        'hash_dd345',
        'digitaldrifter@example.com'
      ),
      (
        'EpicExplorer',
        'hash_ee678',
        'epicexplorer@example.com'
      ),
      (
        'RetroRanger',
        'hash_rr901',
        'retroranger@example.com'
      ),
      (
        'CryptoCrafter',
        'hash_cc234',
        'cryptocrafter@example.com'
      ),
      (
        'SonicSeeker',
        'hash_ss567',
        'sonicseeker@example.com'
      ),
      (
        'RocketRider',
        'hash_rr890',
        'rocketrider@example.com'
      ),
      (
        'TerraTraveler',
        'hash_tt123',
        'terratraveler@example.com'
      ),
      (
        'GlitchGuru',
        'hash_gg456',
        'glitchguru@example.com'
      ),
      (
        'TimelessTraveler',
        'hash_tt789',
        'timelesstraveler@example.com'
      ),
      (
        'MythicalMender',
        'hash_mm012',
        'mythicalmender@example.com'
      ),
      (
        'NebularNinja',
        'hash_nn345',
        'nebularninja@example.com'
      ),
      (
        'CosmoClimber',
        'hash_cc678',
        'cosmoclimber@example.com'
      ),
      (
        'PlasmaPilot',
        'hash_pp901',
        'plasmapilot@example.com'
      ),
      (
        'SolarSailor',
        'hash_ss234',
        'solarsailor@example.com'
      ),
      (
        'MeteorMover',
        'hash_mm567',
        'meteormover@example.com'
      ),
      (
        'LunarLander',
        'hash_ll890',
        'lunarlander@example.com'
      );
  `;
}

export async function down(sql: Sql) {
  await sql`
    DELETE FROM users
    WHERE
      email IN (
        'pixelranger@example.com',
        'techiewizard@example.com',
        'mysterygamer@example.com',
        'quantumleap@example.com',
        'astronomad@example.com',
        'cosmiccoder@example.com',
        'photonseeker@example.com',
        'nebulanavigator@example.com',
        'cybersage@example.com',
        'galaxyvoyager@example.com',
        'novachaser@example.com',
        'quantummechanic@example.com',
        'starsurfer@example.com',
        'virtualvirtuoso@example.com',
        'digitaldrifter@example.com',
        'epicexplorer@example.com',
        'retroranger@example.com',
        'cryptocrafter@example.com',
        'sonicseeker@example.com',
        'rocketrider@example.com',
        'terratraveler@example.com',
        'glitchguru@example.com',
        'timelesstraveler@example.com',
        'mythicalmender@example.com',
        'nebularninja@example.com',
        'cosmoclimber@example.com',
        'plasmapilot@example.com',
        'solarsailor@example.com',
        'meteormover@example.com',
        'lunarlander@example.com'
      );
  `;
}
