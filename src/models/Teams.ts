import API from "./API"
import Team from '../structures/Team'

const getParams = [
  'url',
  'id'
]

/**
 * Teams class
 *
 * @class
 */
export default class Teams {
  _api: API

  /**
   * Teams constructor
   *
   * @param {API} api API instance
   */
  constructor(api: API) {
    this._api = api
  }
  
  /**
   * Gets project by url
   *
   * @param {Object} params 
   * @param {string} params.url
   * @param {string} params.id
   */
  async get(params: Partial<{ url: string, id: string }>): Promise<Team> {
    const param = Object.keys(params).find(e => getParams.some(p => p === e))

    if (!param) {
      throw new Error('No parameter provided, supported: ' + getParams)
    }
    
    const team: Team | {} = await this._api.enqueue(`teams/by/${param}`, params, {
      method: 'GET'
    })

    if (Object.keys(team).length === 0) {
      return null
    }
    
    // @ts-ignore
    return new Team(team[params[param]])
  }
  
  /**
   * Search team by query
   *
   * @param {Object} params 
   * @param {string} params.q Query
   */
  async search(params: { q: string }): Promise<Team[]> {
    const teams = await this._api.enqueue('teams/search', params, {
      method: 'GET',
      oldApi: true
    })

    if (teams.length === 0) {
      return null
    }
    
    return teams.map((team: Team) => new Team(team))
  }
}