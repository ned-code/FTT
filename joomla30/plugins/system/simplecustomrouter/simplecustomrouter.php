<?php
/**
 * @copyright	Copyright (C) 2012 Daniel Calviño Sánchez
 * @license		GNU Affero General Public License version 3 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

jimport('joomla.plugin.plugin');

/**
 * System plugin to attach the SimpleCustomRouter to the Joomla router.
 * The SimpleCustomRouter works only in the frontend, not in the backend.
 * 
 * The SimpleCustomRouter can use a cache to speed up the parsing and building
 * of routes. The default cache configuration can be used, or it can be
 * overriden for this plugin. Thus, the default cache can be disabled but the
 * plugin cache enabled, and the other way around.
 */
class plgSystemSimpleCustomRouter extends JPlugin {
    
    /**
     * Whether the cache will be enabled or not. 
     */
    private $enableCache;
    
    public function plgSystemSimpleCustomRouter(&$subject, $configuration) {
        parent::__construct($subject, $configuration);
        
        if (!isset($this->params)) {
            $this->params = new JRegistry;
        }
        
        if ((!$this->params->get('overrideDefaultConfiguration', false) && !JFactory::getConfig()->get('caching', false)) ||
            ($this->params->get('overrideDefaultConfiguration', false) && !$this->params->get('enableCache', false)) ||
            !JFactory::getConfig()->get('cache_handler', false)) {
            $this->enableCache = false;
        } else {
            $this->enableCache = true;
        }
    }

    /**
     * Attachs the SimpleCustomRouter to the Joomla router after the
     * initialisation of the Joomla application and before the routing.
     */
    public function onAfterInitialise() {
        // Get the application object.
        $app = JFactory::getApplication();

        // Make sure we are not in the administrator.
        if ($app->isAdmin()) {
            return;
        }
        
        $router = $app->getRouter();

        $simpleCustomRouter = new SimpleCustomRouter($this->getCache());
        $router->attachBuildRule(array($simpleCustomRouter, 'build'));
        $router->attachParseRule(array($simpleCustomRouter, 'parse'));
        
        return true;
    }
    
    /**
     * Returns the cache to be used in the SimpleCustomRouter.
     * If the cache is disabled no cache will be returned, as a disabled cache
     * has worse performance than no cache at all.
     * 
     * This method is expected to be called only once.
     * 
     * @return The cache to use, or null if it is disabled.
     */
    private function getCache() {
        if (!$this->enableCache) {
            return null;
        }
        
        $cache = JFactory::getCache('simplecustomrouter', '');
        //Ensure that caching is enabled; if the cache is disabled in the
        //default configuration every cache will be created as disabled.
        $cache->setCaching(true);
        return $cache;
    }
}

/**
 * Configurable router to associate paths and internal Joomla querys.
 * The router can parse a path to get the internal Joomla query, or build a path
 * from the given internal Joomla query. Paths and queries are associated
 * through routes. A route contains a path and a query; when a path is parsed,
 * the router checks if the path of any configured route matches the path to
 * parse. If it matches, the query of the route is used. Reciprocally, when a
 * query is built, the router checks if the query of any configured matches the
 * query to build. If it matches, the path of the route is used.
 * 
 * Routes can be parametrized. For example, a route may contain the path
 * "article-(\d+)/view" and the query "option=com_content&view=article&id={1}".
 * When the path "article-42/view" is parsed, the query
 * "option=com_content&view=article&id=42" will be used. If the query
 * "option=com_content&view=article&id=108" is built, the path
 * "article-108/view" will be generated. Any number of parameters and any
 * regular expression can be used. However, note that only the parameters will
 * be treated as a regular expression; for example, another route with the path
 * "best.articles-(\d+)" will match to "best.articles-42", but not to
 * "best-articles-42" (that is, the dot is just a regular dot).
 * 
 * A route can be associated to an Itemid. When a path that matches with the
 * route path is parsed its Itemid is set in the request (and if there is no
 * Itemid associated to the route, the Itemid is cleared from the request).
 * Thus, the Itemid used will always be the one from the route, even if the path
 * to parse is something like "somePath?Itemid=42". However, the Itemid is not
 * added to the path when the query is built, as it will be used anyway when the
 * path is parsed. In fact, it is even removed from the query if it was
 * explicitly set.
 * 
 * The routes are got from the "#__simplecustomrouter" table in the database. It
 * can be configured from the administrator backend using the simplecustomrouter
 * component.
 * 
 * Note that this router is not a complete router, but just parse and build
 * rules. They have to be attached to the parse and build rules of the Joomla
 * site router after Joomla initialisation and before routing. As the rules are
 * processed before the default parsing and building behaviour of the site
 * router, the rules modify the URI to be parsed or built in a way that
 * overrides that default behaviour. That is, after the rules are processed, the
 * default behaviour is executed, but it will not do anything if the URI to be
 * built has no option field, or if the URI to be parsed has no path (well, in
 * this case, it will be treated as a raw route with a full query, so the only
 * thing that will be done is set the active menu based on the Itemid).
 * 
 * When more than one matching route is found, this router just takes
 * into account the first one found. So when a path or query to parse or build
 * is ambiguous it must be processed before getting to this router. This can be
 * done just with a system plugin that is attached to the site router rules
 * before this router and processes the conflictive routes.
 * 
 * A cache can be used to speed up the parsing and building of routes. However,
 * note that a disabled cache has worse performance than no cache at all. 
 */
class SimpleCustomRouter {

    /**
     * The cache to use.
     */
    private $cache;
    
    /**
     * Creates a new SimpleCustomRouter.
     * 
     * @param JCache $cache The cache to use, if any.
     */
    public function SimpleCustomRouter($cache = null) {
        $this->cache = $cache;
    }
    
    /**
     * Builds a path from the given internal Joomla query.
     * The path of the URI is set to the parametrized matching route path, and
     * the fields of the matching route query are removed from the query of the
     * URI (including the Itemid). If no matching route is found the URI is not
     * modified.
     *
     * The matching route is the most specific route, that is, the one with more
     * fields or, between two routes with the same number of fields, the one
     * with less parameters.
     * 
     * @param JRouterSite siteRouter The Joomla router.
     * @param JURI uri The URI to build.
     * @return JURI The URI.
     */
    public function build(&$siteRouter, &$uri) {
        $cacheId = $uri->getQuery(false);
        if (!empty($this->cache)) {
            $cachedPathAndQuery = $this->cache->get('build: '.$cacheId);
        
            if (!empty($cachedPathAndQuery)) {
                $uri->setPath($cachedPathAndQuery[0]);
                $uri->setQuery($cachedPathAndQuery[1]);
                return $uri;
            }
        }
        
        $query = $uri->getQuery(true);
        
        $matchingRoute = $this->getMatchingRouteFromQuery($query);
        if (empty($matchingRoute)) {
            return $uri;
        }
        
        $path = $this->getParametrizedPathForMatchingRoute($matchingRoute);
        foreach (array_keys($matchingRoute['route']->query) as $key) {
            unset($query[$key]);
        }
        unset($query['Itemid']);
        
        $uri->setPath($path);
        $uri->setQuery($query);

        if (!empty($this->cache)) {
            $this->cache->store(array($uri->getPath(), $uri->getQuery(false)), 'build: '.$cacheId);
        }
        
        return $uri;   
    }

    /**
     * Parses the given path to get its internal Joomla query.
     * The fields of the parametrized matching route query are prepended to the
     * query of the URI (as a string), and the path of the URI is set to an
     * empty string. The Itemid associated to the route is set in the Joomla
     * request and removed from the query. If there is no Itemid associated to
     * the route the Itemid from the request is removed. If no matching route is
     * found the URI and the request are not modified.
     * 
     * The Joomla router will set in the request the variables returned by the
     * parsing, so the Itemid could be added to the returned array. However, the
     * Joomla router will also treat the route as a raw route and set the active
     * menu item based on the Itemid set in the request. This will be done
     * before it sets the variables in the request, so the Itemid has to be
     * explicitly set here in the request instead of adding it to the returned
     * array. Thus, the returned array will be empty.
     * 
     * @param JRouterSite siteRouter The Joomla router.
     * @param JURI uri The URI to parse.
     * @return array An empty array.
     */
    public function parse(&$siteRouter, &$uri) {
        $vars = array();
        
        $cacheId = $uri->getPath();
        if (!empty($this->cache)) {
            $cachedQueryAndItemId = $this->cache->get('parse: '.$cacheId);
        
            if (!empty($cachedQueryAndItemId)) {
                $uri->setPath('');
                $uri->setQuery($cachedQueryAndItemId[0]);
                if ($cachedQueryAndItemId[1]) {
                    JRequest::setVar('Itemid', $cachedQueryAndItemId[1]);
                } else {
                    JRequest::setVar('Itemid', null);
                }
                return $vars;
            }
        }
        
        $path = $uri->getPath();
        $path = str_replace(JURI::base() . '/', '', $path);
        $path = rtrim($path, '/');
        
        $matchingRoute = $this->getMatchingRouteFromPath($path);
        if (empty($matchingRoute)) {
            return $vars;
        }
        
        $newQuery = $this->getParametrizedQueryForMatchingRoute($matchingRoute);
        $oldQuery = $uri->getQuery(false);
        if (!empty($oldQuery)) {
            $newQuery = $newQuery.'&'.$oldQuery;
        }
        
        //Remove Itemid from the query
        $newQuery = preg_replace('#Itemid=[^&]*&#', '', $newQuery);
        $newQuery = preg_replace('#&?Itemid=.*#', '', $newQuery);
        
        $uri->setPath('');
        $uri->setQuery($newQuery);
        if ($matchingRoute['route']->itemId) {
            JRequest::setVar('Itemid', $matchingRoute['route']->itemId);
        } else {
            JRequest::setVar('Itemid', null);
        }
        
        if (!empty($this->cache)) {
            $this->cache->store(array($uri->getQuery(false), $matchingRoute['route']->itemId), 'parse: '.$cacheId);
        }
        
        return $vars;
    }

    /**
     * Tries to find a configured route with a query that matches the given one.
     * Several routes may match, but only the most specific route is taken into
     * account. The most specific route is the one with more fields or, between
     * two routes with the same number of fields, the one with less parameters.
     * If several routes are "the best", the first found is returned.
     * 
     * If a matching route is found, it does not return the route itself, but a
     * "matching route", that is, an array with the route object in the 'route'
     * key and the matched parameters in the 'parameters' key.
     * 
     * Note that the parameters are stored as an array. The '0' key will contain
     * the full query, and the '1', '2', '3'... keys will contain the value of
     * the parameters themselves. The '0' key will be always present, even if
     * the matching route has no parameters.
     *  
     * @param array $query The query to match.
     * @return array The matching route, or null if there is none.
     */
    private function getMatchingRouteFromQuery($query) {
        $routes = $this->getRoutes();
        if (empty($routes)) {
            return null;
        }

        $candidateRoutes = array();
        foreach ($routes as $route) {
            $this->switchParameterPatternsFromPathToQuery($route);
            
            //Mimick the getMatchingRouteFromPath behaviour and include the full
            //query as the parameter '0'.
            $parameters = array();
            $parameters[] = $route->query;
            
            //The query comes as a string, so it has to be converted to an array
            //parse_str can not be used, as it wipes out characters like '+',
            //used in the regular expressions
            $route->query = $this->queryStringToArray($route->query);
            
            if ($this->checkRouteMatchesQuery($route, $query, $parameters)) {
                $candidateRoute = array();
                $candidateRoute['route'] = $route;
                $candidateRoute['parameters'] = $parameters;
                
                $candidateRoutes[] = $candidateRoute;
            }
        }
        
        if (empty($candidateRoutes)) {
            return null;
        }
        
        return $this->getBestCandidateRouteForQuery($candidateRoutes);
    }

    /**
     * Switchs the parameter patterns from the path of the route to the query.
     * The routes are defined with patterns for the parameters in the path
     * (regular expressions between '(' and ')') and placeholders for those
     * parameters in the query (numbers between '{' and '}'), that is, where
     * those parameters should appear in the query. When matching a path against
     * a route and then replacing in the query the parameter placeholders with
     * the matched values everything is fine. But, to match a query against a
     * route and then replace in the path the parameter placerholders with the
     * matched values the parameter patterns and placeholder must be switch from
     * the path to the query and the other way round.
     * 
     * @param object $route The route to switch its parameters.
     */
    private function switchParameterPatternsFromPathToQuery($route) {
        $path = $route->path;
        $query = $route->query;
        
        //$parameterPatterns[index][0][0] contains the parameter pattern
        //(including parenthesis); $parameterPatterns[index][0][1] contains the
        //position of the parameter in the path string.
        if (!preg_match_all('(\([^\)]+\))', $route->path, $parameterPatterns, PREG_SET_ORDER | PREG_OFFSET_CAPTURE)) {
            return;
        }
        
        //$parameterPlaceholders[index][0][0] contains the parameter placeholder
        //(including keys); $parameterPlaceholders[index][0][1] contains the
        //position of the placeholder in the query string.
        preg_match_all('(\{\d+\})', $route->query, $parameterPlaceholders, PREG_SET_ORDER | PREG_OFFSET_CAPTURE);
        
        $parameterPlaceholderIndexDeltas = array();
        $parameterPatternIndexDeltas = array();
        for ($i=0; $i<count($parameterPlaceholders); $i++) {
            $currentParameterPlaceholderDelta = 0;
            $currentParameterPatternDelta = 0;
            
            $parameterPlaceholderString = $parameterPlaceholders[$i][0][0];
            $parameterPlaceholderIndex = $parameterPlaceholders[$i][0][1];
            //Parameter placeholder numbers start in 1, not in 0!
            $parameterIndex = (int)substr($parameterPlaceholderString, 1, -1);
            
            //The current parameter placeholder position in the query string
            //differs from the original position due to the replacement of the
            //previous placeholders for their patterns. Also note that if a
            //previous placeholder appeared after the current one in the string
            //it will not affect the position of the current one.
            foreach (array_keys($parameterPlaceholderIndexDeltas) as $key) {
                if ($key < $i) {
                    $currentParameterPlaceholderDelta += $parameterPlaceholderIndexDeltas[$key];
                }
            }
            
            //Same as above, but for patterns in the path replaced by
            //placeholders.
            foreach (array_keys($parameterPatternIndexDeltas) as $key) {
                if ($key < $parameterIndex) {
                    $currentParameterPatternDelta += $parameterPatternIndexDeltas[$key];
                }
            }
            
            $query = substr_replace($query, $parameterPatterns[$parameterIndex-1][0][0], $parameterPlaceholderIndex + $currentParameterPlaceholderDelta, strlen($parameterPlaceholderString));
            $path = substr_replace($path, '{'.($i+1).'}', $parameterPatterns[$parameterIndex-1][0][1] + $currentParameterPatternDelta, strlen($parameterPatterns[$parameterIndex-1][0][0]));
            
            $parameterPlaceholderIndexDeltas[$i] = strlen($parameterPatterns[$parameterIndex-1][0][0]) - strlen($parameterPlaceholderString);
            $parameterPatternIndexDeltas[$parameterIndex-1] = strlen($parameterPlaceholderString) - strlen($parameterPatterns[$parameterIndex-1][0][0]);
        }
        
        $route->path = $path;
        $route->query = $query;
    }
    
    /**
     * Prepares a path or query string to be used with preg_match, that is, it
     * escapes the special regular expression characters from the given string,
     * but keeping the regular expressions used for parameter patterns.
     * 
     * @param string $stringToEscape The string to escape.
     * @return string The escaped string.
     */
    private function preparePathOrQueryRegularExpression($stringToEscape) {
        //$parameterPatterns[index][0] contains the parameter pattern
        //(including parenthesis).
        if (!preg_match_all('(\([^\)]+\))', $stringToEscape, $parameterPatterns, PREG_SET_ORDER)) {
            return preg_quote($stringToEscape);
        }
        
        $escapedString = preg_quote($stringToEscape);
        
        foreach ($parameterPatterns as $parameterPattern) {
            $escapedParameterPattern = preg_quote($parameterPattern[0]);
            $escapedString = str_replace($escapedParameterPattern, $parameterPattern[0], $escapedString);
        }
        
        return $escapedString;
    }
    
    /**
     * Converts a query string to an array.
     * The array contains one element for each field in the query. The key of
     * each element is the name of the field, and the value of each element is
     * the value of the field.
     * Unlike parse_str, it preserves the values, which is a must when the query
     * contains a regular expression (parse_str wipes out '+' characters, for
     * example).
     * 
     * @param string $query The query string.
     * @return array The array representation of the query.
     */
    private function queryStringToArray($query) {
        $queryArray = array();
        
        $queryFields = explode('&', $query);
        foreach ($queryFields as $field) {
            list($key, $value) = explode('=', $field);
            $queryArray[$key] = $value;
        }
        
        return $queryArray;
    }
    
    /**
     * Checks whether the route matches the given query or not.
     * The route matches the given query if all the fields of the query of the
     * route exist in the given query, and their values match the values of the
     * given query. If the query of the route contains parameters, the value of
     * the parameters in the given query will be added to the given parameters
     * array.
     * 
     * Note that the given query may have more fields than the query of the
     * route, yet it could match if all the fields of the query of the route
     * match the ones in the given query. That is, the given query can have
     * extra fields.
     * 
     * @param object $route The route to check.
     * @param array $query The query to check the route against.
     * @param array $parameters The array to add the value of the parameters to.
     * @return boolean True if the route matches the query, false otherwise.
     */
    private function checkRouteMatchesQuery($route, $query, &$parameters) {
        foreach ($route->query as $fieldName => $fieldValuePattern) {
            $fieldValuePattern = $this->preparePathOrQueryRegularExpression($fieldValuePattern);
            
            if (!isset($query[$fieldName]) || !preg_match('#^'.$fieldValuePattern.'$#', $query[$fieldName], $matchedFieldParameters)) {
                return false;
            }
            
            for ($i=1; $i<count($matchedFieldParameters); $i++) {
                $parameters[] = $matchedFieldParameters[$i];
            }
        }
        
        return true;
    }
    
    /**
     * Selects the best matching route based on the query.
     * Longer queries (that is, queries with more fields) are preferred over
     * shorter ones, and between queries with the same number of fields, less
     * parametrized queries are preferred over more parametrized ones.
     * If two routes have queries with the same number of fields and the same
     * number of parameters, the first one is taken into account.
     * 
     * @param array $candidateRoutes The candidate routes to select from.
     * @return object The best route for the query. 
     */
    private function getBestCandidateRouteForQuery($candidateRoutes) {
        $bestRouteIndex = 0;
        $bestRouteFieldCount = count($candidateRoutes[0]['route']->query);
        $bestRouteParameterCount = count($candidateRoutes[0]['parameters']);
        for ($i=1; $i<count($candidateRoutes); $i++) {
            if ((count($candidateRoutes[$i]['route']->query) > $bestRouteFieldCount) ||
                (count($candidateRoutes[$i]['route']->query) == $bestRouteFieldCount &&
                    count($candidateRoutes[$i]['parameters']) < $bestRouteParameterCount)) {
                $bestRouteIndex = $i;
                $bestRouteFieldCount = count($candidateRoutes[$i]['route']->query);
                $bestRouteParameterCount = count($candidateRoutes[$i]['parameters']);
            }
        }
        
        return $candidateRoutes[$bestRouteIndex];
    }
    
    /**
     * Replaces the parameter placeholders in the path string with the matched
     * query values.
     * 
     * @param array $matchingRoute A matching route, with the route object in
     *        the 'route' key and the matched parameters in the 'parameters'
     *        key.
     * @return string The path string with the replaced parameters.
     */
        private function getParametrizedPathForMatchingRoute($matchingRoute) {
        return $this->replaceParameters($matchingRoute['route']->path, $matchingRoute['parameters']);
    }
    
    /**
     * Tries to find a configured route with a path that matches the given one.
     * If several routes match, only the first one is taken into account. 
     * 
     * If a matching route is found, it does not return the route itself, but a
     * "matching route", that is, an array with the route object in the 'route'
     * key and the matched parameters in the 'parameters' key.
     * 
     * Note that the parameters are stored as an array. The '0' key will contain
     * the full path, and the '1', '2', '3'... keys will contain the value of
     * the parameters themselves. The '0' key will be always present, even if
     * the matching route has no parameters.
     *  
     * @param string $path The path to match.
     * @return object The first matching route, or null if there is none.
     */
    private function getMatchingRouteFromPath($path) {
        $routes = $this->getRoutes();
        if (empty($routes)) {
            return null;
        }

        foreach ($routes as $route) {
            $route->path = $this->preparePathOrQueryRegularExpression($route->path);
            
            if (preg_match('#^'.$route->path.'$#', $path, $parameters)) {
                $matchingRoute = array();
                $matchingRoute['route'] = $route;
                $matchingRoute['parameters'] = $parameters;
                
                return $matchingRoute;
            }
        }
        
        return null;
    }
    
    /**
     * Replaces the parameter placeholders in the query string with the matched
     * path values.
     * 
     * @param array $matchingRoute A matching route, with the route object in
     *        the 'route' key and the matched parameters in the 'parameters'
     *        key.
     * @return string The query string with the replaced parameters.
     */
    private function getParametrizedQueryForMatchingRoute($matchingRoute) {
        return $this->replaceParameters($matchingRoute['route']->query, $matchingRoute['parameters']);
    }

    /**
     * Replaces the '{key1}', '{key2}', '{key3}'... appearances in the original
     * string with the values of the parameters.
     * 
     * @param string $originalString The string to replace the parameters in.
     * @param array $parameters The values of the parameters to replace.
     * @return string The string with the replaced parameters.
     */
    private function replaceParameters($originalString, $parameters) {
        $replacedString = $originalString;

        foreach ($parameters as $parameterKey => $parameterValue) {
            $replacedString = str_replace('{'.$parameterKey.'}', $parameterValue, $replacedString);
        }
        
        return $replacedString;
    }
    
    /**
     * Returns an array with all the configured routes.
     * Each element of the array is an object that represents a route, with
     * string attributes 'path', 'query' and 'itemId'.
     * 
     *  @return array An array with all the configured routes.
     */
    private function getRoutes() {
        $db = JFactory::getDbo();
        $query = $db->getQuery(true);
        
        $query->select('*');
        $query->from('#__simplecustomrouter');
        $db->setQuery($query);
        
        try {
            $result = $db->loadObjectList();
        } catch (DatabaseException $e) {
            return null;
        }
        
        return $result;
    }
}
