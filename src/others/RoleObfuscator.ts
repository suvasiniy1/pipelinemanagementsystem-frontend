class RoleObfuscator {
  // Map actual roles to obfuscated values
  private static readonly ROLE_MAP = {
    0: 'sys_adm_9x7k2',
    1: 'usr_mgr_4h8n1', 
    2: 'std_usr_6m3p9',
    3: 'bsc_usr_2l5q7'
  };

  // Reverse map for decoding
  private static readonly REVERSE_MAP = {
    'sys_adm_9x7k2': 0,
    'usr_mgr_4h8n1': 1,
    'std_usr_6m3p9': 2,
    'bsc_usr_2l5q7': 3
  };

  public static encodeRole(role: number): string {
    return this.ROLE_MAP[role as keyof typeof this.ROLE_MAP] || 'invalid_role';
  }

  public static decodeRole(encodedRole: string): number | null {
    const role = this.REVERSE_MAP[encodedRole as keyof typeof this.REVERSE_MAP];
    return role !== undefined ? role : null;
  }

  public static isValidEncodedRole(encodedRole: string): boolean {
    return encodedRole in this.REVERSE_MAP;
  }
}

export default RoleObfuscator;